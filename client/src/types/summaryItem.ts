import { RenderCellValue } from "./table";

export type SummaryItem = {
  colors: string[];
  mainText: RenderCellValue;
  subText?: RenderCellValue;
  leftTop?: string;
  rightTop?: string;
};

export type GroupedSummaryItems = {
  title: RenderCellValue;
  summaryItems: SummaryItem[];
};
