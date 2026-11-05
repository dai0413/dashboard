export const getDateKey = (date: Date): number =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
