import { ReactNode } from "react";
import { positionBase } from "../../components/formation/positionBase";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";

type TooltipLine = {
  text: string;
  bold?: boolean;
};

export type FormationItem = {
  position: keyof typeof positionBase;

  centerText?: ReactNode;
  label?: ReactNode;
  link?: string;

  tooltip?: TooltipLine[];

  size?: number;
  color?: string;
  textColor?: string;
};

export type PositionListItem = {
  position: string;
  players: PlayerStatistic[];
};
