import { NationalMatchSeries } from "../../../types/models/national-match-series";
import { country } from "./country";

export const nationalMatchSeries = (t: NationalMatchSeries): string => {
  return `${t.name}-${country(t.country)}`;
};
