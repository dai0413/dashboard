import {
  TeamMatchFormationPopulatedSchema,
  TeamMatchFormationFormSchema,
} from "@dai0413/myorg-shared";
import { Label } from "../types";
import z from "zod";
import { Match } from "./match";
import { Team } from "./team";
import { Formation } from "./formation";

export type TeamMatchFormation = Omit<
  z.infer<typeof TeamMatchFormationPopulatedSchema>,
  "match" | "team" | "formation"
> & {
  match: Match;
  team: Team;
  formation: Formation;
};

export type TeamMatchFormationForm = Partial<
  Omit<
    z.infer<typeof TeamMatchFormationFormSchema>,
    "match" | "team" | "formation"
  > & {
    match: Match["_id"];
    team: Team["_id"];
    formation: Formation["_id"];
  }
>;

export type TeamMatchFormationGet = Omit<
  TeamMatchFormation,
  "match" | "team" | "formation"
> & {
  match: Label;
  team: Label;
  formation: Label;
};
