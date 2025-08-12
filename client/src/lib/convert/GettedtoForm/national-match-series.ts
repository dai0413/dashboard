import { teamClassOptions } from "../../../context/options-provider";
import {
  NationalMatchSeriesForm,
  NationalMatchSeriesGet,
} from "../../../types/models/national-match-series";

export const nationalMatchSeries = (
  t: NationalMatchSeriesGet
): NationalMatchSeriesForm => {
  const team_class = teamClassOptions.find(
    (item) => item.label === t.team_class
  )?.key;

  return {
    ...t,
    joined_at: t.joined_at ? t.joined_at.toISOString() : "",
    left_at: t.left_at ? t.left_at.toISOString() : "",
    country: t.country.id,
    team_class: team_class ? team_class : "",
  };
};
