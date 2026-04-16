import { OptionArray, OptionTable } from "../../../types/option";
import { NationalMatchSeriesGet } from "../../../types/models/national-match-series";
import { ageGroup } from "@dai0413/myorg-shared";
import { ColumnType } from "../../../types/table";

const AgeGroupOptions = ageGroup().map((item) => item.key);
type AgeGroup = (typeof AgeGroupOptions)[number] | null;

type Option = {
  label: string;
  key: string;
  country: string;
  age_group: AgeGroup;
};

export const nationalMatchSeries = (
  data: NationalMatchSeriesGet[],
  table: boolean,
): OptionArray | OptionTable<Option> => {
  const options: Option[] = data.map((d) => ({
    label: d.name,
    key: d._id,
    country: d.country.label,
    age_group: d.age_group,
  }));

  if (table === true) {
    return {
      header: [
        {
          label: "シリーズ名",
          field: "label",
          type: ColumnType.FIELD,
          id: "label",
        },
        {
          label: "国名",
          field: "country",
          type: ColumnType.FIELD,
          id: "country",
        },
        {
          label: "年代・種別",
          field: "age_group",
          type: ColumnType.FIELD,
          id: "age_group",
        },
      ],
      data: options,
    };
  }

  return options;
};
