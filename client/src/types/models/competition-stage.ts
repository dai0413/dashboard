import {
  CompetitionStageZodSchema,
  CompetitionStageFormSchema,
} from "@dai0413/myorg-shared";
import { Label } from "../types";
import { Season } from "./season";
import { Competition } from "./competition";
import z from "zod";

export type CompetitionStage = Omit<
  z.infer<typeof CompetitionStageZodSchema>,
  "competition" | "season" | "parent_stage"
> & {
  competition: Competition;
  season: Season;
  parent_stage?: CompetitionStage;
};

export type CompetitionStageForm = Partial<
  Omit<
    z.infer<typeof CompetitionStageFormSchema>,
    "competition" | "season" | "parent_stage"
  > & {
    competition: Competition["_id"];
    season: Season["_id"];
    parent_stage: CompetitionStage["_id"];
  }
>;

export type CompetitionStageGet = Omit<
  CompetitionStage,
  "competition" | "season" | "parent_stage"
> & {
  competition: Label;
  season: Label;
  parent_stage?: Label;
};
