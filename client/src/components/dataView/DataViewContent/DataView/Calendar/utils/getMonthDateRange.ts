export const getMonthDateRange = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const fromDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

  return {
    fromDate,
    endDate,
  };
};
