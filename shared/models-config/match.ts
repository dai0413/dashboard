import z from "zod";
import { MatchModel, IMatch } from "../../server/models/match.ts";
import {
  MatchZodSchema,
  MatchType,
  MatchFormSchema,
  MatchResponseSchema,
} from "../schemas/match.schema.ts";
import { ControllerConfig } from "../../server/modelsConfig/types/type.ts";

export const match: ControllerConfig<
  IMatch,
  MatchType,
  z.infer<typeof MatchFormSchema>,
  z.infer<typeof MatchResponseSchema>
> = {
  name: "match",
  SCHEMA: {
    DATA: MatchZodSchema,
    FORM: MatchFormSchema,
    RESPONSE: MatchResponseSchema,
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
  getALL: {
    sort: { _id: 1 },
  },
  bulk: false,
  download: false,
  TEST: {
    sampleData: [
      {
        competition_stage: "68c0e28d3bf5cb103be963a6",
        home_team: "685fe9e1bdafffc53f471928",
        away_team: "685fe9e1bdafffc53f471929",
        match_week: 1,
      },
      {
        competition_stage: "68c0e28d3bf5cb103be963a6",
        home_team: "685fe9e1bdafffc53f471928",
        away_team: "685fe9e1bdafffc53f471929",
        match_week: 2,
      },
      {
        competition_stage: "68c0e28d3bf5cb103be963a6",
        home_team: "685fe9e1bdafffc53f471928",
        away_team: "685fe9e1bdafffc53f471929",
        match_week: 3,
      },
    ],
    updatedData: {
      home_goal: 1,
      away_goal: 2,
    },
  },
};
