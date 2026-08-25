import { CalendarData, CalendarDataItem } from "../types";
import { createEmptyCalendarData } from "./createEmptyCalendarData";

const getCalendarData = (
  date: Date,
  data: CalendarDataItem[],
): CalendarData => {
  const targetData = data.find(
    (item) =>
      item.date.getFullYear() === date.getFullYear() &&
      item.date.getMonth() === date.getMonth() &&
      item.date.getDate() === date.getDate(),
  );

  return targetData?.data
    ? {
        ...createEmptyCalendarData(),
        ...targetData.data,
      }
    : createEmptyCalendarData();
};

export const createCalendarDays = (
  data: CalendarDataItem[],
  year: number,
  month: number,
): CalendarDataItem[] => {
  const firstDate = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0);

  // 月曜 = 0 ... 日曜 = 6
  const firstDayOfWeek = (firstDate.getDay() + 6) % 7;
  const lastDayOfWeek = (lastDate.getDay() + 6) % 7;

  const startDate = new Date(firstDate);
  startDate.setDate(firstDate.getDate() - firstDayOfWeek);

  const endDate = new Date(lastDate);
  endDate.setDate(lastDate.getDate() + (6 - lastDayOfWeek));

  const days: CalendarDataItem[] = [];

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const date = new Date(currentDate);

    days.push({
      date,
      isCurrentMonth: date.getMonth() === firstDate.getMonth(),
      data: getCalendarData(date, data),
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
};
