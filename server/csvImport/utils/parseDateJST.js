import { fromZonedTime } from "date-fns-tz";

export function parseDateJST(dateStr) {
  // CSVの日付フォーマットをパース（例: "1992/9/5 15:00:00"）
  // JSTとして解釈し、UTCに変換したDateを返す
  if (!dateStr) return undefined;
  return fromZonedTime(new Date(dateStr), "Asia/Tokyo");
}
