import { result } from "@myorg/shared";
import { Label } from "../types";
import { Competition } from "./competition";
import { CompetitionStage } from "./competition-stage";
import { MatchFormat } from "./match-format";
import { Season } from "./season";
import { Stadium } from "./stadium";
import { Team } from "./team";

const resultOptions = result().map((p) => p.key);
type Result = (typeof resultOptions)[number];

export type Match = {
  _id: string;
  competition: Competition;
  competition_stage: CompetitionStage;
  season: Season;
  home_team: Team;
  away_team: Team;
  match_format?: MatchFormat;
  stadium?: Stadium;
  play_time?: number;
  date?: Date;
  audience?: number;
  home_goal?: number;
  away_goal?: number;
  home_pk_goal?: number;
  away_pk_goal?: number;
  result?: Result;
  match_week?: number;
  weather?: string;
  temperature?: number;
  humidity?: number;
  transferurl?: string;
  sofaurl?: string;
  urls?: string[];
  old_id?: string;
};

type MatchPost = Omit<
  Match,
  | "_id"
  //   | "competition"
  | "competition_stage"
  //   | "season"
  | "home_team"
  | "away_team"
  | "match_format"
  | "stadium"
  | "result"
  | "play_time"
  | "date"
> & {
  //   competition: Competition["_id"];
  competition_stage: CompetitionStage["_id"];
  //   season: Season["_id"];
  home_team: Team["_id"];
  away_team: Team["_id"];
  match_format?: MatchFormat["_id"];
  stadium?: Stadium["_id"];
  date: string;
  stadium_name?: string;
};

export type MatchForm = Partial<MatchPost>;

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
