import { ControllerConfig } from "@dai0413/myorg-shared";
import { stringify } from "csv-stringify";
import csv from "csv-parser";
import z from "zod";

import { UploadJob } from "../../../../models/upload-job.js";
import { formatZodError } from "./formatZodError.js";
import { DecodedRequest } from "../../../../types/types.js";
import { cleanObject } from "./cleanObject.js";
import { uploadConfig, UploadConfigMap } from "../../upload-configs/index.js";

export async function processUpload<
  TData extends z.ZodObject<any>,
  TForm extends z.ZodObject<any>,
  TResponse extends z.ZodObject<any>,
  TPopulated extends z.ZodObject<any>,
>(
  jobId: string,
  config: ControllerConfig<TData, TForm, TResponse, TPopulated>,
  req: DecodedRequest,
) {
  try {
    await UploadJob.findByIdAndUpdate(jobId, {
      status: "processing",
    });

    const {
      name,
      SCHEMA: { FORM },
      MONGO_MODEL,
    } = config;

    const { createValidRows } = uploadConfig[name as keyof UploadConfigMap];

    const BATCH_SIZE = 1000;
    const UPDATE_INTERVAL = 100;
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

      if (rowIndex % UPDATE_INTERVAL === 0) {
        await UploadJob.findByIdAndUpdate(jobId, {
          processed: rowIndex,
          totalAdded,
          failedCount,
        });
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

    let csvBase64 = null;
    if (failedCount > 0) {
      const csvString = await new Promise<string>((resolve, reject) => {
        stringify(failedRows, { header: true, quoted: true }, (err, output) => {
          if (err) reject(err);
          else resolve(output);
        });
      });

      csvBase64 = Buffer.from("\uFEFF" + csvString).toString("base64");
    }

    await UploadJob.findByIdAndUpdate(jobId, {
      status: "completed",
      totalAdded,
      failedCount,
      errorCsv: csvBase64 ?? null,
    });
  } catch (err) {
    console.error(err);
    await UploadJob.findByIdAndUpdate(jobId, {
      status: "failed",
    });
  }
}
