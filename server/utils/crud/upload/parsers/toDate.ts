import { fromZonedTime } from "date-fns-tz";
import { FieldParser } from "../types.js";

export const toDate: FieldParser<Date> = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return { ok: true, value: undefined };
  }

  if (typeof value !== "string") {
    return { ok: false, error: `${fieldName}が日付ではありません` };
  }
  const trimmed = typeof value === "string" ? value.trim() : value;
  if (!trimmed) return { ok: false, error: `${fieldName}が日付ではありません` };

  // 日付と時刻を分離
  const [datePart, timePart] = trimmed.split(" ");

  const [y, m, d] = datePart.split("/").map(Number);
  if (!y || !m || !d)
    return { ok: false, error: `${fieldName}が日付ではありません` };

  const [hh = 0, mm = 0, ss = 0] = timePart?.split(":").map(Number) ?? [];

  // ✅ ISO 互換（ゼロ埋め）
  const isoLike = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(
    2,
    "0",
  )}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(
    ss,
  ).padStart(2, "0")}`;

  const result = fromZonedTime(isoLike, "Asia/Tokyo");

  if (isNaN(result.getTime())) {
    return { ok: false, error: `${fieldName}が日付ではありません` };
  }

  return { ok: true, value: result };
};
