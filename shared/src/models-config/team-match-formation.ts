import {
  TeamMatchFormationZodSchema,
  TeamMatchFormationFormSchema,
  TeamMatchFormationResponseSchema,
  TeamMatchFormationPopulatedSchema,
} from "../schemas/team-match-formation.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function teamMatchFormation<TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>,
): ControllerConfig<
  typeof TeamMatchFormationZodSchema,
  typeof TeamMatchFormationFormSchema,
  typeof TeamMatchFormationResponseSchema,
  typeof TeamMatchFormationPopulatedSchema
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "team-match-formation",
    collection_name: "teammatchformations",
    SCHEMA: {
      DATA: TeamMatchFormationZodSchema,
      FORM: TeamMatchFormationFormSchema,
      RESPONSE: TeamMatchFormationResponseSchema,
      POPULATED: TeamMatchFormationPopulatedSchema,
    },
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "match", collection: "matches" },
      { path: "team", collection: "teams" },
      { path: "formation", collection: "formations" },
    ],
    getAllConfig: {
      query: [
        { field: "match", type: "ObjectId" },
        { field: "team", type: "ObjectId" },
        { field: "formation", type: "ObjectId" },
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
          formation: deps.formation[0]._id,
        },
      ],
      updatedData: (deps) => ({ formation: deps.formation[0]._id }),
    },
  };
}
