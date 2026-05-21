import { position_formation } from "@dai0413/myorg-shared";

const position_name = position_formation();
type PositionFormation = (typeof position_name)[number]["key"];

export type Scraped = {
  number?: number | undefined;
  player_name?: string | undefined;
  position?: PositionFormation;
};
export type Form = Scraped;
