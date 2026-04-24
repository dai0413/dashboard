import { OptionArray, OptionTable } from "../../../types/option";
import { FormationGet } from "../../../types/models/formation";
import { ColumnType } from "../../../types/table";
import { Formation } from "../types/optionTable/formation";

export const formation = (
  data: FormationGet[],
  table: boolean,
): OptionArray | OptionTable<Formation> => {
  const options: Formation[] = data.map((d) => ({
    label: d.name,
    key: d._id,
    positions: d.position_formation.map((p) => p).join(","),
  }));

  if (table === true) {
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
  }

  return options;
};
