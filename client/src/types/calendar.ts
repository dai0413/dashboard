import { RenderCellValue } from "./table";

export type CalendarRangeItem = {
  value: RenderCellValue;
  start_date?: Date;
  end_date?: Date;
};

export type MonthlyCalendarGroup = {
  label: string;
  year: number;
  data: CalendarRangeItem[];
};

export type MonthleyCalendarHeaderItem = {
  key: string;
  label: string;
  default?: true;
};

export type PositionedCalendarRangeItem = CalendarRangeItem & {
  row: number;
  startOffset: number;
  endOffset: number;
  showLabel: boolean;
};
