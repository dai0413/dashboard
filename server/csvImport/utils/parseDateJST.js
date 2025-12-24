import { fromZonedTime } from "date-fns-tz";

import { fromZonedTime } from "date-fns-tz";

export function parseDateJST(dateStr) {
  if (!dateStr) return undefined;

  const [datePart, timePart] = dateStr.trim().split(" ");

  // ---- 日付パート ----
  const [y, m, d] = datePart.split("/").map(Number);
  if (!y || !m || !d) return undefined;

  // ---- 時刻パート（あれば）----
  let hour = 0;
  let minute = 0;
  let second = 0;

  if (timePart) {
    const t = timePart.split(":").map(Number);
    hour = t[0] ?? 0;
    minute = t[1] ?? 0;
    second = t[2] ?? 0;
  }

  // 👉 JST の Date を明示的に作る
  const jstDate = new Date(y, m - 1, d, hour, minute, second, 0);

  // 👉 JST として解釈 → UTC に変換
  return fromZonedTime(jstDate, "Asia/Tokyo");
}
