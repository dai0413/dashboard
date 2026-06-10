import { Label, positionGroup } from "@dai0413/myorg-shared";

const PositionGroupOptions = positionGroup().map((item) => item.key);
type PositionGroup = (typeof PositionGroupOptions)[number] | null;

export type NationalCallup = {
  label: string;
  key: string;

  series: Label;
  player: Label;
  number: number | null;
  team: Label;
  team_name: string | null;
  position_group: PositionGroup;
};
