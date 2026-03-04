import { ControllerConfig } from "@dai0413/myorg-shared";
import { stringify } from "csv-stringify/sync";
import csv from "csv-parser";
import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import { DecodedRequest } from "src/types.js";
import { ZodError } from "zod";

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
    SCHEMA: { FORM },
    MONGO_MODEL,
  } = config;

  const { createValidRows } = uploadConfig[name as keyof UploadConfigMap];

  const BATCH_SIZE = 1000;
  let totalAdded = 0;
  let buffer: TInput[] = [];
  const errors: TError[] = [];

  req.decodedStream
    .pipe(
      csv({
        mapHeaders: ({ header }) => header.replace(/'/g, "").trim(),
      }),
    )
    .on("data", async (row) => {
      buffer.push(row);

      if (buffer.length >= BATCH_SIZE) {
        await processBatch(buffer);
        buffer = [];
      }
    })
    .on("end", async () => {
      if (buffer.length > 0) {
        await processBatch(buffer);
      }

      if (errors.length > 0) {
        const csvText = stringify(errors, { header: true, quoted: true });
        const csvBase64 = Buffer.from("\uFEFF" + csvText, "utf8").toString(
          "base64",
        );

        return res.status(StatusCodes.PARTIAL_CONTENT).json({
          message: `${totalAdded}件追加に成功、${errors.length}件失敗`,
          failedCount: errors.length,
          csv: csvBase64,
          filename: "failed.csv",
        });
      }

      res.status(StatusCodes.OK).json({
        message: `${totalAdded}件のデータを追加しました`,
      });
    });

  async function processBatch(rows: TInput[]) {
    const results = await createValidRows(rows);

    const validDocs: any[] = [];

    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      const { error, ...rest } = r;

      if (error) {
        errors.push({ ...r });
        continue;
      }

      try {
        const parsed = FORM.parse(cleanObject(rest));
        validDocs.push(parsed);
      } catch (err) {
        errors.push({
          ...r,
          error: formatZodError(err),
        });
      }
    }

    if (validDocs.length > 0) {
      const inserted = await MONGO_MODEL.insertMany(validDocs, {
        ordered: false,
      });
      totalAdded += inserted.length;
    }
  }
};
