import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { CalendarData, CalendarDataItem, calendarModelTypes } from "../types";
import { createEmptyCalendarData } from "./createEmptyCalendarData";

export const mergeCalendarData = (
  ...items: CalendarDataItem[][]
): CalendarDataItem[] => {
  type MergedCalendarDataItem = {
    date: Date;
    data: CalendarData;
  };
  const map = new Map<string, MergedCalendarDataItem>();

  for (const itemList of items) {
    for (const item of itemList) {
      const key = toDateKey(item.date) as string;

      const existing = map.get(key);

      if (!existing) {
        const data = createEmptyCalendarData();

        for (const modelType of calendarModelTypes) {
          data[modelType].push(...(item.data[modelType] || []));
        }

        map.set(key, {
          date: item.date,
          data,
        });

        continue;
      }

      for (const modelType of calendarModelTypes) {
        existing.data[modelType].push(...(item.data[modelType] || []));
      }
    }
  }

  return [...map.values()].sort((a, b) => a.date.getTime() - b.date.getTime());
};
