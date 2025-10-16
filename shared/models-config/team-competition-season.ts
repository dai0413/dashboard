import z from "zod";
import {
  TeamCompetitionSeasonModel,
  ITeamCompetitionSeason,
} from "../../server/models/team-competition-season.ts";
import {
  TeamCompetitionSeasonZodSchema,
  TeamCompetitionSeasonType,
  TeamCompetitionSeasonFormSchema,
  TeamCompetitionSeasonResponseSchema,
} from "../schemas/team-competition-season.schema.ts";
import { ControllerConfig } from "../../server/modelsConfig/types/type.ts";

export const teamCompetitionSeason: ControllerConfig<
  ITeamCompetitionSeason,
  TeamCompetitionSeasonType,
  z.infer<typeof TeamCompetitionSeasonFormSchema>,
  z.infer<typeof TeamCompetitionSeasonResponseSchema>
> = {
  name: "team-competition-season",
  SCHEMA: {
    DATA: TeamCompetitionSeasonZodSchema,
    FORM: TeamCompetitionSeasonFormSchema,
    RESPONSE: TeamCompetitionSeasonResponseSchema,
  },
  TYPE: {} as TeamCompetitionSeasonType,
  MONGO_MODEL: TeamCompetitionSeasonModel,
  POPULATE_PATHS: [
    { path: "team", collection: "teams" },
    { path: "season", collection: "seasons" },
    { path: "competition", collection: "competitions" },
  ],
  getALL: {
    sort: { _id: 1 },
  },
  bulk: false,
  download: false,
  TEST: {
    sampleData: [
      {
        team: "685fe9e1bdafffc53f471928",
        season: "68b54342990b9673bf8a99c4",
      },
      {
        team: "685fe9e1bdafffc53f471928",
        season: "68b54342990b9673bf8a99c4",
      },
      {
        team: "685fe9e1bdafffc53f471928",
        season: "68b54342990b9673bf8a99c4",
      },
    ],
    updatedData: {
      team: "685fe9e1bdafffc53f471928",
    },
  },
};
