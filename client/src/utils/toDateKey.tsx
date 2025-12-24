export const toDateKey = (
  value: string | number | Date | boolean,
  withTime = false
): string => {
  if (typeof value === "boolean" || !value) return "";

  const date = value instanceof Date ? value : new Date(value);

  const opts: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(withTime && {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };

  const parts = new Intl.DateTimeFormat("ja-JP", opts)
    .formatToParts(date)
    .reduce((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {} as Record<string, string>);

  return withTime
    ? `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`
    : `${parts.year}-${parts.month}-${parts.day}`;
};
