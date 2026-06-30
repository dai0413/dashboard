import { ageGroup } from "@dai0413/myorg-shared";
import {
  NationalMatchSeries,
  NationalMatchSeriesGet,
} from "../../../types/models/national-match-series";
import { country } from "../CreateLabel/country";
import { team } from "../CreateLabel/team";
import { match } from "../CreateLabel/match";

export const nationalMatchSeries = (
  t: NationalMatchSeries,
): NationalMatchSeriesGet => {
  const age_group = ageGroup().find((item) => item.key === t.age_group)?.label;

  const matches = t.matches.map((d) => {
    return {
      label: match(d),
      id: d._id,
    };
  });

  return {
    ...t,
    joined_at:
      typeof t.joined_at === "string" ? new Date(t.joined_at) : t.joined_at,
    left_at: typeof t.left_at === "string" ? new Date(t.left_at) : t.left_at,
    country: {
      label: country(t.country),
      id: t.country._id,
    },
    team: {
      label: t.team ? team(t.team) : "",
      id: t.team ? t.team._id : "",
    },
    matches: matches,
    age_group: age_group ? age_group : "",
  };
};
