import z from "zod";
import { TeamModel, ITeam } from "../mongose/team";
import {
  TeamZodSchema,
  TeamType,
  TeamFormSchema,
  TeamResponseSchema,
  TeamPopulatedSchema,
} from "../schemas/team.schema";
import { ControllerConfig } from "../types";

export const team: ControllerConfig<
  ITeam,
  TeamType,
  z.infer<typeof TeamFormSchema>,
  z.infer<typeof TeamResponseSchema>,
  z.infer<typeof TeamPopulatedSchema>
> = {
  name: "team",
  SCHEMA: {
    DATA: TeamZodSchema,
    FORM: TeamFormSchema,
    POPULATED: TeamPopulatedSchema,
    RESPONSE: TeamResponseSchema,
  },
  TYPE: {} as TeamType,
  MONGO_MODEL: TeamModel,
  POPULATE_PATHS: [{ path: "country", collection: "countries" }],
  getAllConfig: {
    query: [{ field: "country", type: "ObjectId" }],
    sort: { _id: 1 },
  },
  bulk: false,
  download: true,
  TEST: {
    sampleData: [
      {
        team: "TEAM-1",
        enTeam: "Urawa Reds",
        genre: "club",
        division: "1st",
      },
      {
        team: "TEAM-1",
        enTeam: "Urawa Reds",
        genre: "club",
        division: "1st",
      },
      {
        team: "TEAM-1",
        enTeam: "Urawa Reds",
        genre: "club",
        division: "1st",
      },
    ],
    updatedData: {
      abbr: "updated_name",
    },
  },
};
