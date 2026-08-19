import { InjuryFormSchema, InjuryPopulatedSchema } from "@dai0413/myorg-shared";
import { Label } from "../types";
import { Player } from "./player";
import { Team } from "./team";
import z from "zod";

export type Injury = Omit<
  z.infer<typeof InjuryPopulatedSchema>,
  "team" | "now_team" | "player"
> & {
  team?: Team;
  now_team?: Team;
  player: Player;
};

export type InjuryForm = Partial<
  Omit<
    z.infer<typeof InjuryFormSchema>,
    "player" | "team" | "now_team" | "doa" | "doi" | "dos" | "erd"
  > & {
    player: Player["_id"];
    team: Team["_id"];
    now_team: Team["_id"];
    doa: string;
    doi: string;
    dos: string;
    erd: string;
  }
>;

export type InjuryGet = Omit<
  Injury,
  "player" | "team" | "now_team" | "is_injured"
> & {
  player: Label;
  team?: Label;
  now_team?: Label;
  is_injured?: string;
};
