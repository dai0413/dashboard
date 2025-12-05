import z from "zod";
import {
  PlayerRegistrationZodSchema,
  PlayerRegistrationType,
  PlayerRegistrationFormSchema,
  PlayerRegistrationResponseSchema,
  PlayerRegistrationPopulatedSchema,
} from "../schemas/player-registration.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function playerRegistration<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>
): ControllerConfig<
  TDoc,
  PlayerRegistrationType,
  z.infer<typeof PlayerRegistrationFormSchema>,
  z.infer<typeof PlayerRegistrationResponseSchema>,
  z.infer<typeof PlayerRegistrationPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "player-registration",
    collection_name: "playerregistrations",
    SCHEMA: {
      DATA: PlayerRegistrationZodSchema,
      FORM: PlayerRegistrationFormSchema,
      RESPONSE: PlayerRegistrationResponseSchema,
      POPULATED: PlayerRegistrationPopulatedSchema,
    },
    TYPE: {} as PlayerRegistrationType,
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
        { field: "registration_status", type: "String" },
        { field: "registration_type", type: "String" },
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
          season: deps.season[0]._id,
          player: deps.player[0]._id,
          team: deps.team[0]._id,
          number: 1,
          position_group: "GK",
          name: "test",
          en_name: "en_test",
          registration_type: "register",
          height: 180,
          weight: 100,
          homegrown: true,
          isTypeTwo: false,
          isSpecialDesignation: false,
          registration_status: "active",
        },
        {
          date: new Date("2025/02/01"),
          season: deps.season[0]._id,
          player: deps.player[1]._id,
          team: deps.team[1]._id,
          number: 1,
          position_group: "DF",
          name: "test",
          en_name: "en_test",
          registration_type: "register",
          height: 180,
          weight: 100,
          homegrown: true,
          isTypeTwo: false,
          isSpecialDesignation: false,
          registration_status: "active",
        },
      ],
      updatedData: {
        homegrown: true,
        number: 2,
      },
    },
  };
}
