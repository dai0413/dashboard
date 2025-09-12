import { OptionArray, OptionTable } from "../../../types/option";
import { TeamGet } from "../../../types/models/team";

export const team = (
  data: TeamGet[],
  table: boolean
): OptionArray | OptionTable => {
  const options = data.map((d) => ({
    label: d.abbr || d.team,
    key: d._id,
    country: d.country,
    age_group: d.age_group,
  }));

  if (table === true) {
    return {
      header: [
        { label: "チーム", field: "label", width: "200px" },
        { label: "国", field: "country", width: "100px" },
        { label: "年代", field: "age_group", width: "100px" },
      ],
      data: options,
    };
  }

  return options;
};
