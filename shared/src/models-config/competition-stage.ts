import z from "zod";
import {
  CompetitionStageZodSchema,
  CompetitionStageType,
  CompetitionStageFormSchema,
  CompetitionStageResponseSchema,
  CompetitionStagePopulatedSchema,
} from "../schemas/competition-stage.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function competitionStage<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>
): ControllerConfig<
  TDoc,
  CompetitionStageType,
  z.infer<typeof CompetitionStageFormSchema>,
  z.infer<typeof CompetitionStageResponseSchema>,
  z.infer<typeof CompetitionStagePopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "competition-stage",
    collection_name: "competitionstages",
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
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
    download: false,
    TEST: {
      sampleData: (deps) => [
        {
          season: deps.season[0]._id,
          stage_type: "quarter_final",
          order: 0,
        },
        {
          season: deps.season[1]._id,
          stage_type: "1st",
          order: 1,
        },
        {
          season: deps.season[2]._id,
          stage_type: "semi_final",
          order: 2,
        },
      ],
      updatedData: { stage_type: "group_stage" },
    },
  };
}
