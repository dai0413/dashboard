import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { CalendarData, CalendarDataItem } from "../types";
import { createEmptyCalendarData } from "./createEmptyCalendarData";
import { ModelType } from "../../../../types/models";

const mergeCalendarDataItem = (
  target: CalendarData,
  source: Partial<CalendarData>,
) => {
  target[ModelType.TRANSFER].push(...(source[ModelType.TRANSFER] ?? []));

  target[ModelType.INJURY].push(...(source[ModelType.INJURY] ?? []));

  target[ModelType.NATIONAL_MATCH_SERIES].push(
    ...(source[ModelType.NATIONAL_MATCH_SERIES] ?? []),
  );

  target[ModelType.MATCH].push(...(source[ModelType.MATCH] ?? []));

  target[ModelType.PLAYER_REGISTRATION].push(
    ...(source[ModelType.PLAYER_REGISTRATION] ?? []),
  );

  target[ModelType.STAFF_REGISTRATION].push(
    ...(source[ModelType.STAFF_REGISTRATION] ?? []),
  );
};

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

        mergeCalendarDataItem(data, item.data);

        map.set(key, {
          date: item.date,
          data,
        });

        continue;
      }

      mergeCalendarDataItem(existing.data, item.data);
    }
  }

  return [...map.values()].sort((a, b) => a.date.getTime() - b.date.getTime());
};
