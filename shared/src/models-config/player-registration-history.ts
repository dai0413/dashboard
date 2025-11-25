import z from "zod";
import {
  PlayerRegistrationHistoryZodSchema,
  PlayerRegistrationHistoryType,
  PlayerRegistrationHistoryFormSchema,
  PlayerRegistrationHistoryResponseSchema,
  PlayerRegistrationHistoryPopulatedSchema,
} from "../schemas/player-registration-history.schema.js";
import { ControllerConfig } from "../types.js";
import { ParsedQs } from "qs";

export function playerRegistrationHistory<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>
): ControllerConfig<
  TDoc,
  PlayerRegistrationHistoryType,
  z.infer<typeof PlayerRegistrationHistoryFormSchema>,
  z.infer<typeof PlayerRegistrationHistoryResponseSchema>,
  z.infer<typeof PlayerRegistrationHistoryPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "player-registration-history",
    SCHEMA: {
      DATA: PlayerRegistrationHistoryZodSchema,
      FORM: PlayerRegistrationHistoryFormSchema,
      RESPONSE: PlayerRegistrationHistoryResponseSchema,
      POPULATED: PlayerRegistrationHistoryPopulatedSchema,
    },
    TYPE: {} as PlayerRegistrationHistoryType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "season", collection: "seasons" },
      { path: "competition", collection: "competitions" },
      { path: "player", collection: "players" },
      { path: "team", collection: "teams" },
    ],
    getAllConfig: {
      query: [
        { field: "season", type: "ObjectId" },
        { field: "competition", type: "ObjectId" },
        { field: "player", type: "ObjectId" },
        { field: "team", type: "ObjectId" },
        { field: "date", type: "Date" },
      ],
      sort: { _id: 1 },
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
    download: false,
    TEST: {
      sampleData: (deps) => [
        {
          date: new Date("2025/08/01"),
          season: deps.season._id,
          player: deps.player._id,
          team: deps.team._id,
          registration_type: "register",
          changes: {
            number: 1,
            position_group: "GK",
            name: "test",
            en_name: "en_test",
            height: 180,
            weight: 100,
            homegrown: true,
            isTypeTwo: false,
            isSpecialDesignation: false,
          },
        },
      ],
      updatedData: {
        date: new Date("2025/08/02"),
      },
    },
  };
}
