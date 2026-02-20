import z from "zod";
import {
  StatsLZodSchema,
  StatsLType,
  StatsLFormSchema,
  StatsLResponseSchema,
  StatsLPopulatedSchema,
} from "../schemas/stats-l.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function statsL<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>,
): ControllerConfig<
  TDoc,
  StatsLType,
  z.infer<typeof StatsLFormSchema>,
  z.infer<typeof StatsLResponseSchema>,
  z.infer<typeof StatsLPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "stats-l",
    collection_name: "statsls",
    SCHEMA: {
      DATA: StatsLZodSchema,
      FORM: StatsLFormSchema,
      RESPONSE: StatsLResponseSchema,
      POPULATED: StatsLPopulatedSchema,
    },
    TYPE: {} as StatsLType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "match", collection: "matches" },
      { path: "team", collection: "teams" },
    ],
    getAllConfig: {
      query: [
        { field: "match", type: "ObjectId" },
        { field: "team", type: "ObjectId" },
      ],
      sort: { _id: -1 },
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
    download: false,
    TEST: {
      sampleData: (deps) => [
        {
          match: deps.match[0]._id,
          team: deps.team[0]._id,
        },
      ],
      updatedData: { xgFor: 100 },
    },
  };
}
