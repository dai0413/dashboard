import { Label } from "@dai0413/myorg-shared";
import { ModelType } from "../../../types/models";

export const calendarModelTypes = [
  ModelType.TRANSFER,
  ModelType.INJURY,
  ModelType.NATIONAL_MATCH_SERIES,
  ModelType.MATCH,
  ModelType.PLAYER_REGISTRATION,
  ModelType.STAFF_REGISTRATION,
] as const;

type DetailValue = { to?: string; label: string };

export type CalendarEvent = {
  groupByData?: Label;
  counts: number;
  datas: DetailValue[];
};

export type CalendarData = {
  [ModelType.TRANSFER]: CalendarEvent[];
  [ModelType.INJURY]: CalendarEvent[];
  [ModelType.NATIONAL_MATCH_SERIES]: CalendarEvent[];
  [ModelType.MATCH]: CalendarEvent[];
  [ModelType.PLAYER_REGISTRATION]: CalendarEvent[];
  [ModelType.STAFF_REGISTRATION]: CalendarEvent[];
};

export type CalendarDetailItem = {
  group: string;
  value: DetailValue;
  field?: string;
  isRed?: boolean;
};

export type CalendarDataItem = {
  date: Date;
  data: Partial<CalendarData>;
  isCurrentMonth?: boolean;
};
