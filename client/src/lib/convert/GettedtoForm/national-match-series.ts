import {
  NationalMatchSeriesForm,
  NationalMatchSeriesGet,
} from "../../../types/models/national-match-series";
import { ageGroup } from "../../../utils/createOption/ageGroup";

export const nationalMatchSeries = (
  t: NationalMatchSeriesGet
): NationalMatchSeriesForm => {
  const age_group = ageGroup().find((item) => item.label === t.age_group)?.key;

  return {
    ...t,
    joined_at: t.joined_at ? t.joined_at.toISOString() : "",
    left_at: t.left_at ? t.left_at.toISOString() : "",
    country: t.country.id,
    age_group: age_group ? age_group : "",
  };
};
