import { OptionObj } from "../../../types/form/option";
import { PlayerGet } from "../../../types/models/player";
import { ColumnType } from "../../../types/table";
import { Player } from "../types/model/player";

export const player = (data: PlayerGet[]): OptionObj<Player> => {
  const options: Player[] = data.map((d) => ({
    label: d.name || d.en_name || "不明",
    key: d._id,
    dob: d.dob,
  }));

  return {
    fields: [
      {
        label: "名前",
        field: "label",
        getValueType: ColumnType.FIELD,
        key: "label",
        displayOnTable: true,
        type: "string",
      },
      {
        label: "生年月日",
        field: "dob",
        getValueType: ColumnType.FIELD,
        key: "dob",
        displayOnTable: true,
        type: "string",
      },
    ],
    data: options,
  };
};
