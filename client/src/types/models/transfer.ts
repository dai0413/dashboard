import { Label } from "../types";
import { Player } from "./player";
import { Team } from "./team";
import { position } from "../../utils/createOption/Enum/position";
import { form } from "../../utils/createOption/Enum/form";

const positionOptions = position().map((item) => item.key);
const formOptions = form().map((item) => item.key);
type Position = (typeof positionOptions)[number] | null;
type Form = (typeof formOptions)[number] | null;

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

type TransferPost = Omit<
  Transfer,
  "_id" | "player" | "from_team" | "to_team" | "from_date" | "to_date" | "doa"
> & {
  player: Player["_id"];
  from_team: Team["_id"] | null;
  to_team: Team["_id"] | null;
  from_date: string;
  to_date: string;
  doa: string;
  from_team_name: string | null;
  to_team_name: string | null;
};

export type TransferForm = Partial<TransferPost>;

export type TransferGet = Omit<Transfer, "player" | "from_team" | "to_team"> & {
  // doa: string;
  // from_date: string;
  // to_date: string | null;
  player: Label;
  from_team: Label | null;
  to_team: Label | null;
};
