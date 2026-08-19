import { MatchFormSchema, MatchPopulatedSchema } from "@dai0413/myorg-shared";
import { Label } from "../types";
import { Competition } from "./competition";
import { CompetitionStage } from "./competition-stage";
import { MatchFormat } from "./match-format";
import { Season } from "./season";
import { Stadium } from "./stadium";
import { Team } from "./team";
import z from "zod";

export type Match = Omit<z.infer<typeof MatchPopulatedSchema>, "country"> & {
  competition: Competition;
  competition_stage: CompetitionStage;
  season: Season;
  home_team: Team;
  away_team: Team;
  match_format?: MatchFormat;
  stadium?: Stadium;
};

export type MatchForm = Partial<
  Omit<
    z.infer<typeof MatchFormSchema>,
    | "competition"
    | "competition_stage"
    | "season"
    | "home_team"
    | "away_team"
    | "match_format"
    | "stadium"
    | "result"
    | "play_time"
    | "date"
  > & {
    competition_stage: CompetitionStage["_id"];
    home_team: Team["_id"];
    away_team: Team["_id"];
    match_format?: MatchFormat["_id"];
    stadium?: Stadium["_id"];
    date: string;
    stadium_name?: string;
  }
>;

export type MatchGet = Omit<
  Match,
  | "competition"
  | "competition_stage"
  | "season"
  | "home_team"
  | "away_team"
  | "match_format"
  | "stadium"
> & {
  competition: Label;
  competition_stage: Label;
  season: Label;
  home_team: Label;
  away_team: Label;
  match_format?: Label;
  stadium?: Label;
};
