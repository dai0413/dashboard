import z from "zod";
import {
  PlayerZodSchema,
  PlayerType,
  PlayerFormSchema,
  PlayerResponseSchema,
  PlayerPopulatedSchema,
} from "../schemas/player.schema.js";
import { ControllerConfig } from "../types.js";
// import { createPath } from "../utils/createPath";
import { ParsedQs } from "qs";

export function player<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>
): ControllerConfig<
  TDoc,
  PlayerType,
  z.infer<typeof PlayerFormSchema>,
  z.infer<typeof PlayerResponseSchema>,
  z.infer<typeof PlayerPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "player",
    SCHEMA: {
      DATA: PlayerZodSchema,
      FORM: PlayerFormSchema,
      RESPONSE: PlayerResponseSchema,
      POPULATED: PlayerPopulatedSchema,
    },
    TYPE: {} as PlayerType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [],
    getAllConfig: {
      query: [{ field: "country", type: "ObjectId" }],
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
