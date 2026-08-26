import { RenderCellValue } from "./table";

export type DisplayListItem = {
  id: string;
  group?: string;
  field?: string;
  value: RenderCellValue | RenderCellValue[];
  isRed?: boolean;

  displayGroup?: boolean;
  displayField?: boolean;
};
