import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { MatchGet } from "../../../../../types/models/match";
import { PlayerAppearanceGet } from "../../../../../types/models/player-appearance";

export type CircleInfo = {
  is_backup?: boolean;
  is_training_partner?: boolean;
  calledUp: boolean;
  toolTipTitle: string;
  match?: MatchGet;
  playerAppearance?: PlayerAppearanceGet;
  withdrawn?: boolean;
  declined?: boolean;
};

export type DisplayPosition = {
  key: string;
  label: string;
  color?: string;
  positions: string[];
};

export type GroupedPlayers = DisplayPosition & {
  players: MatrixPlayer[];
};

export type MatrixPlayer = PlayerStatistic & {
  ageLabel?: string;
  note?: string;
};
