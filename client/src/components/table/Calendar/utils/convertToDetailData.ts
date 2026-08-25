import { DisplayListItem } from "../../../../types/detail";
import { eventGroups } from "../context/eventGroups";
import { CalendarDataItem, calendarModelTypes } from "../types";

export const convertToDetailData = (
  data: CalendarDataItem["data"],
): DisplayListItem[] => {
  const items: DisplayListItem[] = [];

  for (const modelType of calendarModelTypes) {
    const events = data[modelType];

    if (!events) {
      continue;
    }

    for (const event of events) {
      for (const rowData of event.datas) {
        const group =
          eventGroups.find((g) => g.key === modelType)?.label ?? modelType;

        items.push({
          id: rowData.label,
          group: group,
          field: event.groupByData?.label,
          value: rowData,
        });
      }
    }
  }

  return items.map((item, index, items) => ({
    ...item,
    displayGroup: index === 0 || items[index - 1]?.group !== item.group,
    displayField: index === 0 || items[index - 1]?.field !== item.field,
  }));
};
