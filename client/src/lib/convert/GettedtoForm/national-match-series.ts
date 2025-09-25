import {
  NationalMatchSeriesForm,
  NationalMatchSeriesGet,
} from "../../../types/models/national-match-series";
import { toDateKey } from "../../../utils";
import { ageGroup } from "../../../utils/createOption/Enum/ageGroup";

export const nationalMatchSeries = (
  t: NationalMatchSeriesGet
): NationalMatchSeriesForm => {
  const age_group = ageGroup().find((item) => item.label === t.age_group)?.key;

  return {
    ...t,
    joined_at: t.joined_at ? toDateKey(t.joined_at) : "",
    left_at: t.left_at ? toDateKey(t.left_at) : "",
    country: t.country.id,
    age_group: age_group ? age_group : "",
  };
};
