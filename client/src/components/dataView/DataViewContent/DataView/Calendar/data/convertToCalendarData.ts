import { ModelType } from "../../../../../../types/models";
import { CalendarSourceData } from "../../../../../../types/table/calendar";
import { CalendarDataItem } from "../types";
import { createData, mergeCalendarData } from "../utils";

export const convertToCalendarData = (
  datas: CalendarSourceData[],
): CalendarDataItem[] => {
  const calendarDataList: CalendarDataItem[][] = [];

  // modelType ごとにまとめる
  const grouped = new Map<ModelType, CalendarSourceData[]>();

  for (const data of datas) {
    const existing = grouped.get(data.modelType);

    if (existing) {
      existing.push(data);
    } else {
      grouped.set(data.modelType, [data]);
    }
  }

  for (const [modelType, items] of grouped) {
    const calendarData = createData(
      items.map((item) => item.data),
      modelType,
    );

    calendarDataList.push(calendarData);
  }

  return mergeCalendarData(...calendarDataList);
};
