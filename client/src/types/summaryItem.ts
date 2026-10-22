import { RenderCellValue } from "./table";

export type SummaryItem = {
  colors: string[];
  mainText: RenderCellValue;
  subText?: RenderCellValue;
};

export type GroupedSummaryItems = {
  title: RenderCellValue;
  summaryItems: SummaryItem[];
};
