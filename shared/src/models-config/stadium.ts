import z from "zod";
import {
  StadiumZodSchema,
  StadiumType,
  StadiumFormSchema,
  StadiumResponseSchema,
  StadiumPopulatedSchema,
} from "../schemas/stadium.schema.js";
import { ControllerConfig } from "../types.js";

export function stadium<TDoc = any, TModel = any>(
  mongoModel?: TModel
): ControllerConfig<
  TDoc,
  StadiumType,
  z.infer<typeof StadiumFormSchema>,
  z.infer<typeof StadiumResponseSchema>,
  z.infer<typeof StadiumPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "stadium",
    SCHEMA: {
      DATA: StadiumZodSchema,
      FORM: StadiumFormSchema,
      RESPONSE: StadiumResponseSchema,
      POPULATED: StadiumPopulatedSchema,
    },
    TYPE: {} as StadiumType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [{ path: "country", collection: "countries" }],
    getAllConfig: {
      sort: { _id: 1 },
    },
    bulk: false,
    download: false,
    TEST: {
      sampleData: [
        {
          name: "test_name",
          en_name: "test",
        },
        {
          name: "test_name_2",
          en_name: "test_2",
        },
        {
          name: "test_name_3",
          en_name: "test_3",
        },
      ],
      updatedData: {
        name: "updated_name",
      },
    },
  };
}
