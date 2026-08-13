import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { MatchGet } from "../../../types/models/match";
import { PlayerAppearanceGet } from "../../../types/models/player-appearance";

export type CircleInfo = {
  is_backup?: boolean;
  is_training_partner?: boolean;
  calledUp: boolean;
  toolTipTitle: string;
  match?: MatchGet;
  playerAppearance?: PlayerAppearanceGet;
};

export type DisplayPosition = {
  key: string;
  label: string;
  color?: string;
  positions: string[];
};

export type GroupedPlayers = DisplayPosition & {
  players: PlayerStatistic[];
};
