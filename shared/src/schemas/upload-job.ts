import { z } from "zod";
import { objectId } from "./utils/objectId.js";
import { dateField } from "./utils/dateField.js";

export const UploadJobZodSchema = z.object({
  _id: objectId,
  status: z
    .enum(["pending", "processing", "completed", "failed"])
    .default("pending"),
  total: z.number().default(0),
  processed: z.number().default(0),
  totalAdded: z.number().default(0),
  failedCount: z.number().default(0),
  errorCsv: z.string().nullable().default(null),

  createdAt: dateField,
  updatedAt: dateField,
});

export type UploadJobType = z.infer<typeof UploadJobZodSchema>;
