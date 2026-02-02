import { toBoolean } from "./toBoolean.js";
import { toDate } from "./toDate.js";
import { toNumber } from "./toNumber.js";
import { toObjectId } from "./toObjectId.js";
import { ParserKey } from "./types.js";

type FieldPath<T> = keyof T | string;

type NormalizerRule<T extends Record<string, any>> = {
  field: FieldPath<T> | FieldPath<T>[];
  parserKey: ParserKey;
};

function getByPath(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function setByPath(obj: any, path: string, value: any) {
  const keys = path.split(".");
  let cur = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (cur[k] == null || typeof cur[k] !== "object") {
      cur[k] = {};
    }
    cur = cur[k];
  }

  cur[keys[keys.length - 1]] = value;
}

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
        const path = String(f);
        const currentValue = getByPath(row, path);

        const res = parsersMap[parserKey](currentValue, path);

        if (res.ok) {
          setByPath(row, path, res.value);
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

export { ParserKey } from "./types.js";
