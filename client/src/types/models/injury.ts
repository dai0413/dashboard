import { Player } from "./player";
import { Team } from "./team";

type Injury = {
  _id: string;
  doa: Date;
  team: Team | null;
  now_team: Team | null;
  player: Player;
  doi: Date | null;
  dos: Date | null;
  injured_part: string[];
  is_injured: boolean | null;
  ttp: string;
  erd: Date | null;
  URL: string[] | null;
};

type InjuryPost = Omit<Injury, "_id" | "player" | "team" | "now_team"> & {
  player: Player["_id"];
  from_team: Team["_id"] | null;
  to_team: Team["_id"] | null;
};

export type InjuryForm = Partial<InjuryPost>;
