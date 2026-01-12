import { fromZonedTime } from "date-fns-tz";

export function parseDateJST(dateStr) {
  if (!dateStr) return undefined;

  const trimmed = dateStr.trim();
  if (!trimmed) return undefined;

  // 日付と時刻を分離
  const [datePart, timePart] = trimmed.split(" ");

  const [y, m, d] = datePart.split("/").map(Number);
  if (!y || !m || !d) return undefined;

  const [hh = 0, mm = 0, ss = 0] = timePart?.split(":").map(Number) ?? [];

  // ✅ ISO 互換（ゼロ埋め）
  const isoLike = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(
    2,
    "0"
  )}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(
    ss
  ).padStart(2, "0")}`;

  const result = fromZonedTime(isoLike, "Asia/Tokyo");

  return isNaN(result.getTime()) ? undefined : result;
}
