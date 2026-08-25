import { eventGroups } from "../context/eventGroups";
import {
  CalendarDataItem,
  CalendarDetailItem,
  calendarModelTypes,
} from "../types";

export const convertToDetailData = (
  data: CalendarDataItem["data"],
): CalendarDetailItem[] => {
  const items: CalendarDetailItem[] = [];

  for (const modelType of calendarModelTypes) {
    const events = data[modelType];

    if (!events) {
      continue;
    }

    for (const event of events) {
      for (const rowData of event.datas) {
        items.push({
          group:
            eventGroups.find((g) => g.key === modelType)?.label ?? modelType,
          value: rowData,
          field: event.groupByData?.label,
        });
      }
    }
  }

  return items;
};
