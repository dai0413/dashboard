import z from "zod";
import {
  CompetitionStageModel,
  ICompetitionStage,
} from "../../server/models/competition-stage.ts";
import {
  CompetitionStageZodSchema,
  CompetitionStageType,
  CompetitionStageFormSchema,
  CompetitionStageResponseSchema,
} from "../schemas/competition-stage.schema.ts";
import { ControllerConfig } from "../../server/modelsConfig/types/type.ts";

export const competitionStage: ControllerConfig<
  ICompetitionStage,
  CompetitionStageType,
  z.infer<typeof CompetitionStageFormSchema>,
  z.infer<typeof CompetitionStageResponseSchema>
> = {
  name: "competition-stage",
  SCHEMA: {
    DATA: CompetitionStageZodSchema,
    FORM: CompetitionStageFormSchema,
    RESPONSE: CompetitionStageResponseSchema,
  },
  TYPE: {} as CompetitionStageType,
  MONGO_MODEL: CompetitionStageModel,
  POPULATE_PATHS: [
    { path: "competition", collection: "competitions" },
    { path: "season", collection: "seasons" },
  ],
  getALL: {
    sort: { _id: 1 },
  },
  bulk: true,
  download: false,
  TEST: {
    sampleData: [
      {
        season: "68b7b227b3716945451a5362",
        stage_type: "none",
      },
      {
        season: "68b7b227b3716945451a5362",
        stage_type: "1st",
      },
      {
        season: "68b7b227b3716945451a5362",
        stage_type: "2nd",
      },
    ],
    updatedData: { stage_type: "group_stage" },
  },
};
