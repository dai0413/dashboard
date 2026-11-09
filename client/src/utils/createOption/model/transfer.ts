import { convert } from "../../../lib/convert/CreateLabel";
import { OptionObj } from "../../../types/form/option";
import { ModelType } from "../../../types/models";
import { Transfer } from "../../../types/models/transfer";
import { ColumnType } from "../../../types/table";
import { TransferOption } from "../types/model/transfer";

export const transfer = (data: Transfer[]): OptionObj<TransferOption> => {
  const options: TransferOption[] = data.map((d) => {
    const to_team = d.to_team
      ? {
          label: convert(ModelType.TEAM, d.to_team),
          id: d.to_team._id,
        }
      : d.to_team_name
        ? {
            label: d.to_team_name,
          }
        : undefined;

    return {
      label: `${d.player}-${d.from_date}`,
      key: d._id,

      to_team,
      player: {
        label: convert(ModelType.PLAYER, d.player),
        id: d.player._id,
      },
      position: d.position || [],
    };
  });

  return {
    fields: [
      {
        label: "移籍先",
        field: "to_team",
        getValueType: ColumnType.FIELD,
        key: "to_team",
        displayOnTable: true,
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
        label: "ポジション",
        field: "position",
        getValueType: ColumnType.FIELD,
        key: "position",
        displayOnTable: true,
        type: "string",
      },
    ],
    data: options,
  };
};
