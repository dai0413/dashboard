import { RenderCellValue } from "../../types/table/base";

export const isLabelObject = (
  obj: any,
): obj is { label: string; id: string } => {
  return (
    typeof obj === "object" && obj !== null && "label" in obj && "id" in obj
  );
};

export const isRenderCellValue = (
  obj: string | RenderCellValue,
): obj is RenderCellValue => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "label" in obj &&
    "id" in obj &&
    "to" in obj
  );
};
