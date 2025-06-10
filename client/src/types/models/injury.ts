import { Label } from "../types";
import { Player } from "./player";
import { Team } from "./team";

export type Injury = {
  _id: string;
  doa: Date;
  team: Team | null;
  now_team: Team | null;
  player: Player;
  doi: Date | null;
  dos: Date | null;
  injured_part: string[];
  is_injured: boolean | null;
  ttp: string[] | null;
  erd: Date | null;
  URL: string[] | null;
};

type InjuryPost = Omit<
  Injury,
  "_id" | "player" | "team" | "now_team" | "doa" | "doi" | "dos" | "erd"
> & {
  player: Player["_id"];
  team: Team["_id"] | null;
  now_team: Team["_id"] | null;
  doa: string;
  doi: string;
  dos: string;
  erd: string;
};

export type InjuryForm = Partial<InjuryPost>;

export type InjuryGet = Omit<
  Injury,
  "player" | "team" | "now_team" | "is_injured"
> & {
  player: Label;
  team: Label;
  now_team: Label;
  // injured_part: string | null;
  // ttp: string | null;
  is_injured: string | null;
};
