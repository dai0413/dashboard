import z from "zod";
import {
  PlayerAppearanceZodSchema,
  PlayerAppearanceType,
  PlayerAppearanceFormSchema,
  PlayerAppearanceResponseSchema,
  PlayerAppearancePopulatedSchema,
} from "../schemas/player-appearance.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function playerAppearance<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>
): ControllerConfig<
  TDoc,
  PlayerAppearanceType,
  z.infer<typeof PlayerAppearanceFormSchema>,
  z.infer<typeof PlayerAppearanceResponseSchema>,
  z.infer<typeof PlayerAppearancePopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "player-appearance",
    collection_name: "playerappearances",
    SCHEMA: {
      DATA: PlayerAppearanceZodSchema,
      FORM: PlayerAppearanceFormSchema,
      RESPONSE: PlayerAppearanceResponseSchema,
      POPULATED: PlayerAppearancePopulatedSchema,
    },
    TYPE: {} as PlayerAppearanceType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "match", collection: "matchs" },
      { path: "player", collection: "players" },
      { path: "team", collection: "teams" },
    ],
    getAllConfig: {
      query: [
        { field: "match", type: "ObjectId" },
        { field: "player", type: "ObjectId" },
        { field: "team", type: "ObjectId" },
        { field: "play_status", type: "String" },
        { field: "position", type: "String" },
        { field: "time", type: "Number" },
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
          player: deps.player[0]._id,
          team: deps.team[0]._id,
          number: 1,
          play_status: "start",
          position: "GK",
          time: 90,
        },
      ],
      updatedData: {
        play_status: "sub",
        time: undefined,
      },
    },
  };
}
