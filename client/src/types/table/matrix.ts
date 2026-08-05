import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { NationalCallup } from "../models/national-callup";
import { NationalMatchSeries } from "../models/national-match-series";
import { PlayerAppearanceGet } from "../models/player-appearance";

export type MatrixParams = {
  playerStatistics: PlayerStatistic[];
  nationalCallUp: NationalCallup[];
  nationalMatchSeries: NationalMatchSeries[];
  playerAppearance: PlayerAppearanceGet[];
};
