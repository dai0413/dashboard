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
      fields: [
        {
          label: "シリーズ名",
          field: "label",
          getValueType: ColumnType.FIELD,
          key: "label",
          displayOnTable: true,
          type: "string",
        },
        {
          label: "国名",
          field: "country",
          getValueType: ColumnType.FIELD,
          key: "country",
          displayOnTable: true,
          type: "string",
        },
        {
          label: "年代・種別",
          field: "age_group",
          getValueType: ColumnType.FIELD,
          key: "age_group",
          displayOnTable: true,
          type: "string",
        },
      ],
      data: options,
    };
  }

  return options;
};
