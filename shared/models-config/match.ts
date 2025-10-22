import z from "zod";
import { MatchModel, IMatch } from "../../server/models/match.ts";
import {
  MatchZodSchema,
  MatchType,
  MatchFormSchema,
  MatchResponseSchema,
  MatchPopulatedSchema,
} from "../schemas/match.schema.ts";
import { ControllerConfig } from "../../server/modelsConfig/types/type.ts";
import { match as convertFun } from "../../server/utils/format/match.ts";
import { match as customMatch } from "../../server/modelsConfig/utils/customMatch/match.ts";

export const match: ControllerConfig<
  IMatch,
  MatchType,
  z.infer<typeof MatchFormSchema>,
  z.infer<typeof MatchResponseSchema>,
  z.infer<typeof MatchPopulatedSchema>
> = {
  name: "match",
  SCHEMA: {
    DATA: MatchZodSchema,
    FORM: MatchFormSchema,
    RESPONSE: MatchResponseSchema,
    POPULATED: MatchPopulatedSchema,
  },
  TYPE: {} as MatchType,
  MONGO_MODEL: MatchModel,
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
