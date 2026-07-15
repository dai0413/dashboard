import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import {
  NationalMatchSeriesForm,
  NationalMatchSeriesGet,
} from "../../../types/models/national-match-series";

export const nationalMatchSeries = (
  t: NationalMatchSeriesGet,
): NationalMatchSeriesForm => {
  return {
    ...t,
    joined_at: toDateKey(t.joined_at),
    left_at: toDateKey(t.left_at),
    country: t.country.id,
    team: t.team.id,
    matches: t.matches.map((t) => t.id).filter((t) => typeof t === "string"),
  };
};
