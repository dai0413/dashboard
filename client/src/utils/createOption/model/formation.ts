import { OptionObj } from "../../../types/form/option";
import { Formation } from "../../../types/models/formation";
import { ColumnType } from "../../../types/table";
import { FormationOption } from "../types/model/formation";

export const formation = (data: Formation[]): OptionObj<FormationOption> => {
  const options: FormationOption[] = data.map((d) => ({
    label: d.name,
    key: d._id,
    positions: d.position_formation.map((p) => p).join(","),
  }));

  return {
    fields: [
      {
        label: "名前",
        field: "label",
        width: "60px",
        getValueType: ColumnType.FIELD,
        key: "label",
        displayOnTable: true,
        type: "string",
      },
      {
        label: "ポジション",
        field: "positions",
        width: "220px",
        getValueType: ColumnType.FIELD,
        key: "positions",
        displayOnTable: true,
        type: "string",
      },
    ],
    data: options,
  };
};
