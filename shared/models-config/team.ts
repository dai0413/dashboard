import z from "zod";
import { TeamModel, ITeam } from "../../server/models/team.ts";
import {
  TeamZodSchema,
  TeamType,
  TeamFormSchema,
  TeamResponseSchema,
} from "../schemas/team.schema.ts";
import { ControllerConfig } from "../../server/modelsConfig/types/type.ts";

export const team: ControllerConfig<
  ITeam,
  TeamType,
  z.infer<typeof TeamFormSchema>,
  z.infer<typeof TeamResponseSchema>
> = {
  name: "team",
  SCHEMA: {
    DATA: TeamZodSchema,
    FORM: TeamFormSchema,
    RESPONSE: TeamResponseSchema,
  },
  TYPE: {} as TeamType,
  MONGO_MODEL: TeamModel,
  POPULATE_PATHS: [{ path: "country", collection: "countries" }],
  getALL: {
    query: [{ field: "country", type: "ObjectId" }],
    sort: { _id: 1 },
  },
  bulk: false,
  download: false,
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
