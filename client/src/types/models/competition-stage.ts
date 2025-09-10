import { Label } from "../types";
import { Competition } from "./competition";
import { Season } from "./season";
import { stageType } from "../../utils/createOption/stageType";

const StageTypeOptions = stageType().map((item) => item.key);

type StageType = (typeof StageTypeOptions)[number] | null;

export type CompetitionStage = {
  _id: string;
  competition: Competition;
  season: Season;
  stage_type: StageType;
  name?: string;
  round_number?: Number | null;
  leg?: Number | null;
  order?: Number | null;
  parent_stage?: CompetitionStage;
  notes?: String | null;
};

type CompetitionStagePost = Omit<
  CompetitionStage,
  "_id" | "competition" | "season"
> & {
  competition: Competition["_id"];
  season: Season["_id"];
};

export type CompetitionStageForm = Partial<CompetitionStagePost>;

export type CompetitionStageGet = Omit<
  CompetitionStage,
  "competition" | "season"
> & {
  competition: Label;
  season: Label;
};
