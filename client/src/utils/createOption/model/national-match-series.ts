import { convert } from "../../../lib/convert/CreateLabel";
import { OptionObj } from "../../../types/form/option";
import { ModelType } from "../../../types/models";
import { NationalMatchSeries } from "../../../types/models/national-match-series";
import { ColumnType } from "../../../types/table";
import { NationalMatchSeriesOption } from "../types/model/national-match-series";

export const nationalMatchSeries = (
  data: NationalMatchSeries[],
): OptionObj<NationalMatchSeriesOption> => {
  const options: NationalMatchSeriesOption[] = data.map((d) => ({
    label: d.name,
    key: d._id,
    team: convert(ModelType.TEAM, d.team),
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
        field: "team",
        getValueType: ColumnType.FIELD,
        key: "team",
        displayOnTable: true,
        type: "string",
      },
    ],
    data: options,
  };
};
