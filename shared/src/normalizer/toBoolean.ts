import { FieldParser } from "./types.js";

export const toBoolean: FieldParser<boolean> = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return { ok: true, value: undefined };
  }

  if (typeof value === "boolean") {
    return { ok: true, value };
  }

  if (typeof value === "number") {
    if (value === 1) return { ok: true, value: true };
    if (value === 0) return { ok: true, value: false };
    return { ok: false, error: `${fieldName}が真偽値ではありません` };
  }

  if (typeof value === "string") {
    const v = value.toLowerCase().trim();
    if (["true", "1", "yes", "y"].includes(v)) {
      return { ok: true, value: true };
    }
    if (["false", "0", "no", "n"].includes(v)) {
      return { ok: true, value: false };
    }
  }

  return { ok: false, error: `${fieldName}が真偽値ではありません` };
};
