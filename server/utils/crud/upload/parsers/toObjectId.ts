import mongoose from "mongoose";
import { FieldParser } from "../types.js";

export const toObjectId: FieldParser<String> = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return { ok: true, value: undefined };
  }

  if (typeof value !== "string") {
    return { ok: false, error: `${fieldName}がObjectIdではありません` };
  }

  if (!mongoose.Types.ObjectId.isValid(value)) {
    return { ok: false, error: `${fieldName}がObjectIdではありません` };
  }

  return {
    ok: true,
    value: String(new mongoose.Types.ObjectId(value)),
  };
};
