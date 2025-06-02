import { Label } from "../types";
import { Player } from "./player";
import { Team } from "./team";
import { PositionOptions, FormOptions } from "../../context/options-provider";

type Position = (typeof PositionOptions)[number] | null;
type Form = (typeof FormOptions)[number] | null;

export type Transfer = {
  _id: string;
  doa: Date;
  from_team: Team | null;
  to_team: Team | null;
  player: Player;
  position: Position[] | null;
  form: Form | null;
  number: number | null;
  from_date: Date;
  to_date: Date | null;
  URL: string[] | null;
};

export type TransferPost = Omit<
  Transfer,
  "_id" | "player" | "from_team" | "to_team"
> & {
  player: Player["_id"];
  from_team: Team["_id"] | null;
  to_team: Team["_id"] | null;
};

export type TransferForm = Partial<TransferPost>;

export type TransferGet = Omit<
  Transfer,
  "player" | "from_team" | "to_team" | "doa" | "from_date" | "to_date"
> & {
  doa: string;
  from_date: string;
  to_date: string | null;
  player: Label;
  from_team: Label;
  to_team: Label;
};
