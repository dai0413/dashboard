import { ModelType } from "../../../../../../types/models";
import { CalendarSourceData } from "../../../../../../types/table/calendar";
import { CalendarDataItem } from "../types";
import { createData, mergeCalendarData } from "../utils";

const isCalendarDataItem = (data: unknown): data is CalendarDataItem => {
  if (!data || typeof data !== "object") {
    return false;
  }

  const value = data as Record<string, unknown>;

  return "date" in value && "data" in value;
};

const isCalendarSourceData = (data: unknown): data is CalendarSourceData => {
  if (!data || typeof data !== "object") {
    return false;
  }

  const value = data as Record<string, unknown>;

  return "modelType" in value && "label" in value && "data" in value;
};

export const convertToCalendarData = <T>(datas: T[]): CalendarDataItem[] => {
  if (datas.every(isCalendarDataItem)) {
    return datas as CalendarDataItem[];
  }

  if (!datas.every(isCalendarSourceData)) {
    throw new Error("CalendarDataItem[] or CalendarSourceData[] is required.");
  }

  const calendarSourceDatas = datas.map((d) => d as CalendarSourceData);

  const calendarDataList: CalendarDataItem[][] = [];

  // modelType ごとにまとめる
  const grouped = new Map<ModelType, CalendarSourceData[]>();

  for (const data of calendarSourceDatas) {
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
