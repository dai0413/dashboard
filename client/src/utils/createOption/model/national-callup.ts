import { OptionObj } from "../../../types/form/option";
import { NationalCallupGet } from "../../../types/models/national-callup";
import { ColumnType } from "../../../types/table";
import { NationalCallup } from "../types/model/national-callup";

export const nationalCallup = (
  data: NationalCallupGet[],
): OptionObj<NationalCallup> => {
  const options: NationalCallup[] = data.map((d) => ({
    label: d.series.label,
    key: d._id,

    series: d.series,
    player: d.player,
    number: d.number,
    team: d.team,
    team_name: d.team_name,
    position_group: d.position_group,
  }));

  return {
    fields: [
      {
        label: "シリーズ名",
        field: "series",
        getValueType: ColumnType.FIELD,
        key: "series",
        displayOnTable: false,
        type: "string",
      },
      {
        label: "選手",
        field: "player",
        getValueType: ColumnType.FIELD,
        key: "player",
        displayOnTable: true,
        type: "string",
      },
      {
        label: "背番号",
        field: "number",
        getValueType: ColumnType.FIELD,
        key: "number",
        displayOnTable: false,
        type: "string",
      },
      {
        label: "チーム",
        field: "team",
        getValueType: ColumnType.FIELD,
        key: "team",
        displayOnTable: true,
        type: "string",
      },
      {
        label: "登録外チーム",
        field: "team_name",
        getValueType: ColumnType.FIELD,
        key: "team_name",
        displayOnTable: false,
        type: "string",
      },
      {
        label: "ポジション",
        field: "position_group",
        getValueType: ColumnType.FIELD,
        key: "position_group",
        displayOnTable: true,
        type: "string",
      },
    ],
    data: options,
  };
};
