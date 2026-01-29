import { FieldParser } from "../types.js";

export const toNumber: FieldParser<number> = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return { ok: true, value: undefined };
  }

  const n = Number(value);
  if (Number.isNaN(n)) {
    return { ok: false, error: `${fieldName}が数値ではありません` };
  }

  return { ok: true, value: n };
};
