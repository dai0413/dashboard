import z from "zod";
import {
  MatchTeamFormationZodSchema,
  MatchTeamFormationType,
  MatchTeamFormationFormSchema,
  MatchTeamFormationResponseSchema,
  MatchTeamFormationPopulatedSchema,
} from "../schemas/match-team-formation.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function matchTeamFormation<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>
): ControllerConfig<
  TDoc,
  MatchTeamFormationType,
  z.infer<typeof MatchTeamFormationFormSchema>,
  z.infer<typeof MatchTeamFormationResponseSchema>,
  z.infer<typeof MatchTeamFormationPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "match-team-formation",
    collection_name: "matchteamformations",
    SCHEMA: {
      DATA: MatchTeamFormationZodSchema,
      FORM: MatchTeamFormationFormSchema,
      RESPONSE: MatchTeamFormationResponseSchema,
      POPULATED: MatchTeamFormationPopulatedSchema,
    },
    TYPE: {} as MatchTeamFormationType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "match", collection: "matchs" },
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
    download: true,
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
