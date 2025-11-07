import z from "zod";
import {
  MatchZodSchema,
  MatchType,
  MatchFormSchema,
  MatchResponseSchema,
  MatchPopulatedSchema,
} from "../schemas/match.schema.js";
import { ControllerConfig } from "../types.js";
import { match as convertFun } from "../utils/format/match.js";
import { match as customMatch } from "../utils/customMatchStage/match.js";

export function match<TDoc = any, TModel = any>(
  mongoModel?: TModel
): ControllerConfig<
  TDoc,
  MatchType,
  z.infer<typeof MatchFormSchema>,
  z.infer<typeof MatchResponseSchema>,
  z.infer<typeof MatchPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "match",
    SCHEMA: {
      DATA: MatchZodSchema,
      FORM: MatchFormSchema,
      RESPONSE: MatchResponseSchema,
      POPULATED: MatchPopulatedSchema,
    },
    TYPE: {} as MatchType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "competition", collection: "competitions" },
      { path: "competition_stage", collection: "competitionstages" },
      { path: "season", collection: "seasons" },
      { path: "home_team", collection: "teams" },
      { path: "away_team", collection: "teams" },
      { path: "match_format", collection: "matchformats" },
      { path: "stadium", collection: "stadia" },
    ],
    getAllConfig: {
      query: [
        { field: "limit", type: "Number" },
        { field: "competition", type: "ObjectId" },
        { field: "season", type: "ObjectId" },
        { field: "date", type: "Date" },
      ],
      sort: { _id: 1 },
      buildCustomMatch: customMatch,
    },
    bulk: false,
    download: false,
    TEST: {
      sampleData: (deps) => [
        {
          competition_stage: deps.competitionStage._id,
          home_team: deps.team._id,
          away_team: deps.team._id,
          match_week: 1,
        },
        {
          competition_stage: deps.competitionStage._id,
          home_team: deps.team._id,
          away_team: deps.team._id,
          match_week: 2,
        },
        {
          competition_stage: deps.competitionStage._id,
          home_team: deps.team._id,
          away_team: deps.team._id,
          match_week: 3,
        },
      ],
      updatedData: {
        home_goal: 1,
        away_goal: 2,
      },
    },
    convertFun: convertFun,
  };
}
