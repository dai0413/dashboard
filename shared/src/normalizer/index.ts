import { toBoolean } from "./toBoolean.js";
import { toDate } from "./toDate.js";
import { formatDateKey } from "./formatDateKey.js";
import { toNumber } from "./toNumber.js";
import { toObjectId } from "./toObjectId.js";
import { ParserKey } from "./types.js";
import { formatDateKeyWithTime } from "./formatDateKeyWithTime.js";

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
        const parser = parsersMap[parserKey];

        if (Array.isArray(currentValue)) {
          const parsedValues = [];
          let error = null;

          for (let i = 0; i < currentValue.length; i++) {
            const res = parser(currentValue[i], `${path}[${i}]`);
            if (!res.ok) {
              error = res.error;
              break;
            }
            parsedValues.push(res.value);
          }

          if (error) {
            row.error = row.error ? `${row.error} / ${error}` : error;
          } else {
            setByPath(row, path, parsedValues);
          }

          continue;
        }

        const res = parser(currentValue, path);

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
  [ParserKey.DateToString]: formatDateKey,
  [ParserKey.DateToStringWithTime]: formatDateKeyWithTime,
};

export { ParserKey } from "./types.js";

export const toDateKey = (
  date?: Date | string | number | null,
  withTime = false,
) => {
  if (!date) return undefined;

  const result = withTime ? formatDateKeyWithTime(date) : formatDateKey(date);

  if (result.ok) return result.value;
  return undefined;
};
