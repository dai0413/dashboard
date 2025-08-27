import { Label } from "../types";
import { Player } from "./player";
import { Country } from "./country";

export type Referee = {
  _id: string;
  name: string;
  en_name: string | null;
  dob: Date | null;
  pob: String | null;
  citizenship: Country[] | null;
  player: Player | null;
  transferurl?: string;
  sofaurl?: string;
};

type RefereePost = Omit<Referee, "_id" | "player" | "citizenship" | "dob"> & {
  citizenship: Country["_id"][] | null;
  player: Player["_id"];
  dob: string;
};

export type RefereeForm = Partial<RefereePost>;

export type RefereeGet = Omit<Referee, "player" | "citizenship"> & {
  player: Label;
  citizenship: Label[];
};
