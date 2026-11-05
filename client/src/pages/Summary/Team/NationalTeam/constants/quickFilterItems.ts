import { fullNationalPeriods } from "../../../../../constants/period";
import { QuickFilterData } from "../../../../../types/table";

export const quickFilterItems: QuickFilterData = {
  name: "dates",
  items: fullNationalPeriods.map((period) => ({
    key: period.key,
    label: period.label,
    filterCondition: [
      {
        key: "joined_at",
        label: "活動開始日",
        type: "Date",
        filterable: true,
        value: [period.startDate],
        valueLabel: [period.startDate],
        operator: "gte",
      },
      {
        key: "left_at",
        label: "解散日",
        type: "Date",
        filterable: true,
        value: [period.endDate],
        valueLabel: [period.endDate],
        operator: "lte",
      },
    ],
  })),
};
