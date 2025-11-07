import z from "zod";
import {
  TeamZodSchema,
  TeamType,
  TeamFormSchema,
  TeamResponseSchema,
  TeamPopulatedSchema,
} from "../schemas/team.schema.js";
import { ControllerConfig } from "../types.js";

export function team<TDoc = any, TModel = any>(
  mongoModel?: TModel
): ControllerConfig<
  TDoc,
  TeamType,
  z.infer<typeof TeamFormSchema>,
  z.infer<typeof TeamResponseSchema>,
  z.infer<typeof TeamPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "team",
    SCHEMA: {
      DATA: TeamZodSchema,
      FORM: TeamFormSchema,
      POPULATED: TeamPopulatedSchema,
      RESPONSE: TeamResponseSchema,
    },
    TYPE: {} as TeamType,
    MONGO_MODEL: mongoModel ?? null,
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
}
