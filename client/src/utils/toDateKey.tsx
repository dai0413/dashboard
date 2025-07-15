export const toDateKey = (value: string | number | Date): string => {
  const date = value instanceof Date ? value : new Date(value);
  // タイムゾーン補正つきのローカル時間で日付を生成
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
