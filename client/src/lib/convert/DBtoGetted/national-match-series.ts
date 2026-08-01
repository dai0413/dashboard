import {
  NationalMatchSeries,
  NationalMatchSeriesGet,
} from "../../../types/models/national-match-series";
import { team } from "../CreateLabel/team";
import { match } from "../CreateLabel/match";

export const nationalMatchSeries = (
  t: NationalMatchSeries,
): NationalMatchSeriesGet => {
  const matches = t.matches
    ? t.matches.map((d) => {
        return {
          label: match(d),
          id: d._id,
        };
      })
    : [];

  return {
    ...t,
    joined_at:
      typeof t.joined_at === "string" ? new Date(t.joined_at) : t.joined_at,
    left_at: typeof t.left_at === "string" ? new Date(t.left_at) : t.left_at,
    team: {
      label: t.team ? team(t.team) : "",
      id: t.team ? t.team._id : "",
    },
    matches: matches,
  };
};
