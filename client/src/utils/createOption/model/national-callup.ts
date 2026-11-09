import { convert } from "../../../lib/convert/CreateLabel";
import { OptionObj } from "../../../types/form/option";
import { ModelType } from "../../../types/models";
import { NationalCallup } from "../../../types/models/national-callup";
import { ColumnType } from "../../../types/table";
import { NationalCallupOption } from "../types/model/national-callup";

export const nationalCallup = (
  data: NationalCallup[],
): OptionObj<NationalCallupOption> => {
  const options: NationalCallupOption[] = data.map((d) => ({
    label: convert(ModelType.NATIONAL_CALLUP, d),
    key: d._id,

    series: {
      label: convert(ModelType.NATIONAL_MATCH_SERIES, d.series),
      id: d.series._id,
    },
    player: {
      label: convert(ModelType.PLAYER, d.player),
      id: d.player._id,
    },
    dob: d.player.dob,
    number: d.number,
    team: {
      label: convert(ModelType.TEAM, d.team),
      id: d.team._id,
    },
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
        label: "生年月日",
        field: "dob",
        getValueType: ColumnType.FIELD,
        key: "dob",
        displayOnTable: true,
        type: "Date",
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
        label: "当時チーム",
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
