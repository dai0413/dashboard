import { RenderCellValue } from "./table";

export type DisplayListItem = {
  id: string;
  group?: string;
  field?: string;
  value: RenderCellValue | RenderCellValue[];
  isRed?: boolean;
  isLink?: boolean;
  onEdit?: () => void;

  displayGroup?: boolean;
  displayField?: boolean;
};
