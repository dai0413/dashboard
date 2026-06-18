import { OptionObj } from "../../../types/form/option";
import { TransferGet } from "../../../types/models/transfer";
import { ColumnType } from "../../../types/table";
import { Transfer } from "../types/model/transfer";

export const transfer = (data: TransferGet[]): OptionObj<Transfer> => {
  const options: Transfer[] = data.map((d) => ({
    label: `${d.player}-${d.from_date}`,
    key: d._id,

    to_team: d.to_team,
    player: d.player,
    position: d.position,
  }));

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
