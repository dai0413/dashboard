import { OptionObj } from "../../../types/form/option";
import { NationalMatchSeriesGet } from "../../../types/models/national-match-series";
import { ColumnType } from "../../../types/table";
import { NationalMatchSeries } from "../types/model/national-match-series";

export const nationalMatchSeries = (
  data: NationalMatchSeriesGet[],
): OptionObj<NationalMatchSeries> => {
  const options: NationalMatchSeries[] = data.map((d) => ({
    label: d.name,
    key: d._id,
    country: d.country.label,
    age_group: d.age_group,
  }));

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
};
