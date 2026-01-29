import { ControllerConfig } from "@dai0413/myorg-shared";
import { stringify } from "csv-stringify/sync";
import csv from "csv-parser";
import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import { Types } from "mongoose";
import { DecodedRequest } from "types.js";
import { ZodError } from "zod";

import { getNest } from "../../getNest.js";
import { convertObjectIdToString } from "../../convertObjectIdToString.js";
import { uploadConfig, UploadConfigMap } from "./configs/index.js";
import { cleanObject } from "./services/cleanObject.js";

function formatZodError(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues
      .map((issue) => {
        const path = issue.path.join(".");
        return path ? `${path}: ${issue.message}` : issue.message;
      })
      .join(", ");
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "unknown error";
}

export const uploadItemHandler = async <
  TInput,
  TDoc,
  TData,
  TForm,
  TRes,
  TPopulated,
>(
  config: ControllerConfig<TDoc, TData, TForm, TRes, TPopulated>,
  req: DecodedRequest,
  res: Response,
) => {
  type TError = TInput & {
    error: string;
    row?: number;
  };

  const {
    name,
    SCHEMA: { POPULATED, FORM },
    MONGO_MODEL,
    POPULATE_PATHS,
  } = config;

  const { createValidRows } = uploadConfig[name as keyof UploadConfigMap];

  const rows: TInput[] = [];
  const errors: TError[] = [];
  const added: { _id: Types.ObjectId }[] = [];

  req.decodedStream
    .pipe(
      csv({
        mapHeaders: ({ header }) => header.replace(/'/g, "").trim(),
      }),
    )
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", async () => {
      if (rows.length === 0) {
        return res.status(StatusCodes.PARTIAL_CONTENT).json({
          message: `選択したファイルにはデータがありません`,
        });
      }

      const results: TError[] = await createValidRows(rows);

      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        const { error, row, ...rest } = r;
        const value = rest;

        if (error) {
          errors.push({
            ...r,
            row: i + 2,
          });
          continue;
        }

        try {
          const parsed = FORM.parse(cleanObject(value));
          const add = await MONGO_MODEL.create(parsed);
          added.push(add);
        } catch (err) {
          errors.push({
            ...r,
            row: i + 2,
            error: formatZodError(err),
          });
        }
      }

      if (errors.length > 0) {
        const csvErrors: TError[] = errors.map((e) => {
          return {
            ...e,
          };
        });

        const csvText = stringify(csvErrors, { header: true, quoted: true });
        const bom = "\uFEFF";
        const csvWithBom = bom + csvText;
        const csvBase64 = Buffer.from(csvWithBom, "utf8").toString("base64");

        return res.status(StatusCodes.PARTIAL_CONTENT).json({
          message: `${added.length}件追加に成功、${errors.length}件失敗`,
          failedCount: errors.length,
          csv: csvBase64,
          filename: "failed.csv",
        });
      }

      const populatedAdded = await MONGO_MODEL.find({
        _id: { $in: added.map((a: any) => a._id) },
      })
        .populate(getNest(true, POPULATE_PATHS))
        .lean();

      const processed = populatedAdded.map((item: any) => {
        const plain = convertObjectIdToString(item);
        const parsed = POPULATED.parse(plain);
        return parsed;
      });

      res.status(StatusCodes.OK).json({
        message: `${populatedAdded.length}件のデータを追加しました`,
        data: processed,
      });
    });
};
