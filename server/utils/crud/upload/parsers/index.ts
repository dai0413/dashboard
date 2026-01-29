import { ParserKey } from "../types.js";
import { toBoolean } from "./toBoolean.js";
import { toDate } from "./toDate.js";
import { toNumber } from "./toNumber.js";
import { toObjectId } from "./toObjectId.js";

type NormalizerRule<T> = {
  field: keyof T | (keyof T)[];
  parserKey: ParserKey;
};

export const normalizeRows = <
  T extends Record<string, any> & { error?: string },
>(
  rows: T[],
  rules: NormalizerRule<T>[],
): T[] => {
  const result = [...rows];

  for (const row of result) {
    for (const { field, parserKey } of rules) {
      const fields = Array.isArray(field) ? field : [field];

      for (const f of fields) {
        const res = parsersMap[parserKey](row[f], String(f));

        if (res.ok) {
          row[f] = res.value as any;
        } else {
          row.error = row.error ? `${row.error} / ${res.error}` : res.error;
        }
      }
    }
  }

  return result;
};

export const parsersMap = {
  [ParserKey.Number]: toNumber,
  [ParserKey.Boolean]: toBoolean,
  [ParserKey.ObjectId]: toObjectId,
  [ParserKey.Date]: toDate,
};
