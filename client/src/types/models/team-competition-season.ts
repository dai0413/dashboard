import z from "zod";
import { Label } from "../types";
import { Competition } from "./competition";
import { Season } from "./season";
import { Team } from "./team";
import {
  TeamCompetitionSeasonFormSchema,
  TeamCompetitionSeasonPopulatedSchema,
} from "@dai0413/myorg-shared";

export type TeamCompetitionSeason = Omit<
  z.infer<typeof TeamCompetitionSeasonPopulatedSchema>,
  "team" | "season" | "competition"
> & {
  team: Team;
  season: Season;
  competition: Competition;
};

export type TeamCompetitionSeasonForm = Partial<
  Omit<
    z.infer<typeof TeamCompetitionSeasonFormSchema>,
    "team" | "season" | "competition"
  > & {
    team?: Team["_id"];
    season?: Season["_id"];
    competition?: Competition["_id"];
  }
>;

export type TeamCompetitionSeasonGet = Omit<
  TeamCompetitionSeason,
  "team" | "season" | "competition"
> & {
  team: Label;
  season: Label;
  competition: Label;
};
