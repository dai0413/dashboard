import {
  PlayerZodSchema,
  PlayerFormSchema,
  PlayerResponseSchema,
  PlayerPopulatedSchema,
} from "../schemas/player.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function player<TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>,
): ControllerConfig<
  typeof PlayerZodSchema,
  typeof PlayerFormSchema,
  typeof PlayerResponseSchema,
  typeof PlayerPopulatedSchema
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "player",
    collection_name: "players",
    SCHEMA: {
      DATA: PlayerZodSchema,
      FORM: PlayerFormSchema,
      RESPONSE: PlayerResponseSchema,
      POPULATED: PlayerPopulatedSchema,
    },
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "citizenship", collection: "countries", isArray: true },
    ],
    getAllConfig: {
      query: [
        { field: "citizenship", type: "ObjectId", isArray: true },
        {
          field: "citizenship.name",
          type: "String",
          isArray: true,
          populateAfter: true,
        },
      ],
      sort: { _id: 1 },
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
    download: true,
    TEST: {
      sampleData: [
        {
          name: "test_name",
          en_name: "test",
        },
        {
          name: "test_name_2",
          en_name: "test_2",
          dob: new Date("2025/08/01"),
        },
        {
          name: "test_name_3",
          en_name: "test_3",
          dob: new Date("2025/08/01"),
          pob: "東京都",
        },
      ],
      updatedData: {
        name: "updated_name",
      },
      // testDataPath: createPath("player"),
    },
  };
}
