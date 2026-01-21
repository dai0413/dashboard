import { OptionArray, OptionTable } from "../../../types/option";
import { FormationGet } from "../../../types/models/formation";

export const formation = (
  data: FormationGet[],
  table: boolean,
): OptionArray | OptionTable => {
  const options = data.map((d) => ({
    label: d.name,
    key: d._id,
    positions: d.position_formation.map((p) => p).join(","),
  }));

  if (table === true) {
    return {
      header: [
        { label: "名前", field: "label", width: "60px" },
        { label: "ポジション", field: "positions", width: "220px" },
      ],
      data: options,
    };
  }

  return options;
};
