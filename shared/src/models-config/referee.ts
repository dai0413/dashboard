import {
  RefereeZodSchema,
  RefereeFormSchema,
  RefereeResponseSchema,
  RefereePopulatedSchema,
} from "../schemas/referee.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function referee<TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>,
): ControllerConfig<
  typeof RefereeZodSchema,
  typeof RefereeFormSchema,
  typeof RefereeResponseSchema,
  typeof RefereePopulatedSchema
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "referee",
    collection_name: "referees",
    SCHEMA: {
      DATA: RefereeZodSchema,
      FORM: RefereeFormSchema,
      RESPONSE: RefereeResponseSchema,
      POPULATED: RefereePopulatedSchema,
    },
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "citizenship", collection: "countries", isArray: true },
      { path: "player", collection: "players" },
    ],
    getAllConfig: {
      sort: { _id: 1 },
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
    download: false,
    TEST: {
      sampleData: [
        {
          name: "TEST_NAME",
          en_name: "test name1",
        },
        {
          name: "TEST_NAME1",
          en_name: "test name2",
        },
        {
          name: "TEST_NAME3",
          en_name: "test name3",
        },
      ],
      updatedData: {
        name: "updated_name",
      },
    },
  };
}
