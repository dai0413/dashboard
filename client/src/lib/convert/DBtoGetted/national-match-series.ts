import {
  NationalMatchSeries,
  NationalMatchSeriesGet,
} from "../../../types/models/national-match-series";
import { teamClass } from "../../../utils/createOption/teamClass";

export const nationalMatchSeries = (
  t: NationalMatchSeries
): NationalMatchSeriesGet => {
  const team_class = teamClass().find(
    (item) => item.key === t.team_class
  )?.label;

  return {
    ...t,
    joined_at:
      typeof t.joined_at === "string" ? new Date(t.joined_at) : t.joined_at,
    left_at: typeof t.left_at === "string" ? new Date(t.left_at) : t.left_at,
    country: {
      label: t.country.name ?? "不明",
      id: t.country._id ?? "",
    },
    team_class: team_class ? team_class : "",
  };
};
