import { NationalCallup } from "../../../types/models/national-callup";
import { nationalMatchSeries } from "./national-match-series";
import { player } from "./player";

export const nationalCallup = (t: NationalCallup): string => {
  return `${nationalMatchSeries(t.series)}-${player(t.player)}`;
};
