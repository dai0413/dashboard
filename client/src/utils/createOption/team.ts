import { OptionArray, OptionTable } from "../../types/option";
import { TeamGet } from "../../types/models/team";

export const team = (
  data: TeamGet[],
  table: boolean
): OptionArray | OptionTable => {
  const options = data.map((d) => ({
    label: d.abbr || d.team,
    key: d._id,
  }));

  if (table === true) {
    return {
      header: [{ label: "チーム", field: "label" }],
      data: options,
    };
  }

  return options;
};
