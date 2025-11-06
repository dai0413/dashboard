import z from "zod";
import { CompetitionModel, ICompetition } from "../mongose/competition.ts";
import {
  CompetitionZodSchema,
  CompetitionType,
  CompetitionFormSchema,
  CompetitionResponseSchema,
  CompetitionPopulatedSchema,
} from "../schemas/competition.schema.ts";
import { ControllerConfig } from "../types.ts";

export const competition: ControllerConfig<
  ICompetition,
  CompetitionType,
  z.infer<typeof CompetitionFormSchema>,
  z.infer<typeof CompetitionResponseSchema>,
  z.infer<typeof CompetitionPopulatedSchema>
> = {
  name: "competition",
  SCHEMA: {
    DATA: CompetitionZodSchema,
    FORM: CompetitionFormSchema,
    RESPONSE: CompetitionResponseSchema,
    POPULATED: CompetitionPopulatedSchema,
  },
  TYPE: {} as CompetitionType,
  MONGO_MODEL: CompetitionModel,
  POPULATE_PATHS: [{ path: "country", collection: "countries" }],
  getAllConfig: {
    sort: { _id: 1 },
    query: [{ field: "country", type: "ObjectId" }],
  },
  bulk: false,
  download: false,
  TEST: {
    sampleData: (deps) => [
      {
        name: "Ｊ１リーグ",
        abbr: "J1",
        country: deps.country._id,
        competition_type: "club",
        category: "league",
        level: "1部",
        age_group: "full",
        official_match: true,
      },
      {
        name: "Ｊ２リーグ",
        abbr: "J2",
        country: deps.country._id,
        competition_type: "club",
        category: "league",
        level: "2部",
        age_group: "full",
        official_match: true,
      },
      {
        name: "Ｊ３リーグ",
        abbr: "J3",
        country: deps.country._id,
        competition_type: "club",
        category: "league",
        level: "3部",
        age_group: "full",
        official_match: true,
      },
    ],
    updatedData: {
      name: "updated_league",
    },
  },
};
