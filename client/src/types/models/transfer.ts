import {
  TransferFormSchema,
  TransferPopulatedSchema,
} from "@dai0413/myorg-shared";
import { Label } from "../types";
import { Player } from "./player";
import { Team } from "./team";
import z from "zod";

export type Transfer = Omit<
  z.infer<typeof TransferPopulatedSchema>,
  "from_team" | "to_team" | "player"
> & {
  from_team?: Team;
  to_team?: Team;
  player: Player;
};

export type TransferForm = Partial<
  Omit<
    z.infer<typeof TransferFormSchema>,
    "player" | "from_team" | "to_team" | "from_date" | "to_date" | "doa"
  > & {
    player: Player["_id"];
    from_team: Team["_id"];
    to_team: Team["_id"];
    from_date: string;
    to_date: string;
    doa: string;
    from_team_name: string;
    to_team_name: string;
  }
>;

export type TransferGet = Omit<
  Transfer,
  "player" | "from_team" | "to_team" | "isCancelled"
> & {
  player: Label;
  from_team?: Label;
  to_team?: Label;
  isCancelled: string;
};
