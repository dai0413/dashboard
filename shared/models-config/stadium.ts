import z from "zod";
import { StadiumModel, IStadium } from "../../server/models/stadium.ts";
import {
  StadiumZodSchema,
  StadiumType,
  StadiumFormSchema,
  StadiumResponseSchema,
} from "../schemas/stadium.schema.ts";
import { ControllerConfig } from "../../server/modelsConfig/types/type.ts";

export const stadium: ControllerConfig<
  IStadium,
  StadiumType,
  z.infer<typeof StadiumFormSchema>,
  z.infer<typeof StadiumResponseSchema>
> = {
  name: "stadium",
  SCHEMA: {
    DATA: StadiumZodSchema,
    FORM: StadiumFormSchema,
    RESPONSE: StadiumResponseSchema,
  },
  TYPE: {} as StadiumType,
  MONGO_MODEL: StadiumModel,
  POPULATE_PATHS: [{ path: "country", collection: "countries" }],
  getALL: {
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
