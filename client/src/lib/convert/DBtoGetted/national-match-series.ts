import { ageGroup } from "@myorg/shared";
import {
  NationalMatchSeries,
  NationalMatchSeriesGet,
} from "../../../types/models/national-match-series";
import { country } from "../CreateLabel/country";

export const nationalMatchSeries = (
  t: NationalMatchSeries
): NationalMatchSeriesGet => {
  const age_group = ageGroup().find((item) => item.key === t.age_group)?.label;

  return {
    ...t,
    joined_at:
      typeof t.joined_at === "string" ? new Date(t.joined_at) : t.joined_at,
    left_at: typeof t.left_at === "string" ? new Date(t.left_at) : t.left_at,
    country: {
      label: country(t.country),
      id: t.country._id,
    },
    age_group: age_group ? age_group : "",
  };
};
