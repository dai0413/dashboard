import { position_formation } from "@dai0413/myorg-shared";

const position_name = position_formation();
type PositionFormation = (typeof position_name)[number]["key"];

type ScrapedBase = {
  number?: number | undefined;
  player_name?: string | undefined;
  position?: PositionFormation;
};

export type Scraped = {
  home: ScrapedBase[];
  away: ScrapedBase[];
};
export type Form = Scraped;
