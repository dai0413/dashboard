import { OptionArray } from "@dai0413/myorg-shared";
import { SummaryTabItems } from "../../types/menu/IconButton";

export function createTabsOptionArray(items: SummaryTabItems[]): OptionArray {
  return items
    .filter((item) => item.icon && item.text && !item["cursor-not-allowed"])
    .map((item) => ({
      key: item.icon,
      label: item.text,
    })) as OptionArray;
}
