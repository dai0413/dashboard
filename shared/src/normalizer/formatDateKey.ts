import { FieldParser } from "./types.js";

export const formatDateKey: FieldParser<string> = (value, fieldName) => {
  if (
    !(value instanceof Date) &&
    typeof value !== "number" &&
    typeof value !== "string"
  ) {
    return { ok: false, error: `${fieldName}が日付ではありません` };
  }
  const date = value instanceof Date ? value : new Date(value);

  const opts: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const parts = new Intl.DateTimeFormat("ja-JP", opts)
    .formatToParts(date)
    .reduce(
      (acc, p) => {
        if (p.type !== "literal") acc[p.type] = p.value;
        return acc;
      },
      {} as Record<string, string>,
    );

  const result = `${parts.year}-${parts.month}-${parts.day}`;

  return { ok: true, value: result };
};
