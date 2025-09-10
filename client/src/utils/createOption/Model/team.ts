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
    genre: d.genre,
  }));

  if (table === true) {
    return {
      header: [
        { label: "チーム", field: "label", width: "200px" },
        { label: "国", field: "country", width: "100px" },
        { label: "ジャンル", field: "genre", width: "100px" },
      ],
      data: options,
    };
  }

  return options;
};
