import z from "zod";
import {
  CompetitionStageZodSchema,
  CompetitionStageType,
  CompetitionStageFormSchema,
  CompetitionStageResponseSchema,
  CompetitionStagePopulatedSchema,
} from "../schemas/competition-stage.schema.js";
import { ControllerConfig } from "../types.js";

export function competitionStage<TDoc = any, TModel = any>(
  mongoModel?: TModel
): ControllerConfig<
  TDoc,
  CompetitionStageType,
  z.infer<typeof CompetitionStageFormSchema>,
  z.infer<typeof CompetitionStageResponseSchema>,
  z.infer<typeof CompetitionStagePopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "competition-stage",
    SCHEMA: {
      DATA: CompetitionStageZodSchema,
      FORM: CompetitionStageFormSchema,
      RESPONSE: CompetitionStageResponseSchema,
      POPULATED: CompetitionStagePopulatedSchema,
    },
    TYPE: {} as CompetitionStageType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "competition", collection: "competitions" },
      { path: "season", collection: "seasons" },
    ],
    getAllConfig: {
      query: [{ field: "season", type: "ObjectId" }],
      sort: { _id: 1 },
    },
    bulk: true,
    download: false,
    TEST: {
      sampleData: (deps) => [
        {
          season: deps.season._id,
          stage_type: "quarter_final",
          order: 0,
        },
        {
          season: deps.season._id,
          stage_type: "1st",
          order: 1,
        },
        {
          season: deps.season._id,
          stage_type: "semi_final",
          order: 2,
        },
      ],
      updatedData: { stage_type: "group_stage" },
    },
  };
}
