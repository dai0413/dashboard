import { ControllerConfig } from "@dai0413/myorg-shared";
import { stringify } from "csv-stringify";
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
  const {
    name,
    SCHEMA: { FORM },
    MONGO_MODEL,
  } = config;

  const { createValidRows } = uploadConfig[name as keyof UploadConfigMap];

  const BATCH_SIZE = 1000;
  let buffer: any[] = [];
  let totalAdded = 0;
  let failedCount = 0;
  let rowIndex = 1; // ヘッダー分

  let failedRows: any[] = [];

  const parser = req.decodedStream.pipe(
    csv({
      mapHeaders: ({ header }) =>
        header
          .replace(/^\uFEFF/, "")
          .replace(/['"]/g, "")
          .trim(),
    }),
  );

  try {
    for await (const row of parser) {
      rowIndex++;
      const [result] = await createValidRows([row]);

      if (result.error) {
        failedRows.push({ ...row, row: rowIndex });
        failedCount++;
        continue;
      }

      try {
        const parsed = FORM.parse(cleanObject(result));
        buffer.push(parsed);
      } catch (err) {
        failedRows.push({
          ...row,
          row: rowIndex,
          error: formatZodError(err),
        });
        failedCount++;
        continue;
      }

      if (buffer.length >= BATCH_SIZE) {
        try {
          await MONGO_MODEL.insertMany(buffer, { ordered: false });
          totalAdded += buffer.length;
        } catch (err: any) {
          if (err?.code === 11000 && err.writeErrors) {
            // 重複行をCSVへ
            for (const writeError of err.writeErrors) {
              const failedDoc = buffer[writeError.index];

              failedRows.push({
                ...failedDoc,
                error: "重複データです",
              });

              failedCount++;
            }

            // 成功分だけ加算
            const successCount = buffer.length - err.writeErrors.length;

            totalAdded += successCount;
          } else {
            throw err;
          }
        }

        buffer = [];
      }
    }

    if (buffer.length > 0) {
      try {
        await MONGO_MODEL.insertMany(buffer, { ordered: false });
        totalAdded += buffer.length;
      } catch (err: any) {
        if (err?.code === 11000 && err.writeErrors) {
          for (const writeError of err.writeErrors) {
            const failedDoc = buffer[writeError.index];

            failedRows.push({
              ...failedDoc,
              error: "重複データです",
            });

            failedCount++;
          }

          const successCount = buffer.length - err.writeErrors.length;

          totalAdded += successCount;
        } else {
          throw err;
        }
      }
    }

    if (failedCount > 0) {
      const csvString = await new Promise<string>((resolve, reject) => {
        stringify(failedRows, { header: true, quoted: true }, (err, output) => {
          if (err) reject(err);
          else resolve(output);
        });
      });

      const csvBase64 = Buffer.from("\uFEFF" + csvString).toString("base64");

      res.status(StatusCodes.PARTIAL_CONTENT).json({
        message: `${totalAdded}件追加に成功、${failedCount}件失敗`,
        failedCount,
        csv: csvBase64,
        filename: "failed.csv",
      });

      return;
    }

    res.json({
      message: `${totalAdded}件追加しました`,
    });
  } catch (error) {
    console.error(error);

    const mes =
      error && typeof error === "object" && "message" in error
        ? error.message
        : "アップロード中にエラーが発生しました";

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: mes,
    });
  }
};
