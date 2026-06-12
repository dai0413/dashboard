import { Label, position } from "@dai0413/myorg-shared";

const PositionOptions = position().map((item) => item.key);
type Position = (typeof PositionOptions)[number] | null;

export type Transfer = {
  label: string;
  key: string;

  player: Label;
  to_team: Label | null;
  position: Position[] | null;
};
