import z from "zod";
import {
  RefereeZodSchema,
  RefereeType,
  RefereeFormSchema,
  RefereeResponseSchema,
  RefereePopulatedSchema,
} from "../schemas/referee.schema.js";
import { ControllerConfig } from "../types.js";
import { ParsedQs } from "qs";

export function referee<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>
): ControllerConfig<
  TDoc,
  RefereeType,
  z.infer<typeof RefereeFormSchema>,
  z.infer<typeof RefereeResponseSchema>,
  z.infer<typeof RefereePopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "referee",
    SCHEMA: {
      DATA: RefereeZodSchema,
      FORM: RefereeFormSchema,
      RESPONSE: RefereeResponseSchema,
      POPULATED: RefereePopulatedSchema,
    },
    TYPE: {} as RefereeType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "citizenship", collection: "countries" },
      { path: "player", collection: "players" },
    ],
    getAllConfig: {
      sort: { _id: 1 },
      buildCustomMatch: customMatchFn,
    },
    bulk: false,
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
