import z from "zod";
import { StadiumModel, IStadium } from "../mongose/stadium";
import {
  StadiumZodSchema,
  StadiumType,
  StadiumFormSchema,
  StadiumResponseSchema,
  StadiumPopulatedSchema,
} from "../schemas/stadium.schema";
import { ControllerConfig } from "../types";

export const stadium: ControllerConfig<
  IStadium,
  StadiumType,
  z.infer<typeof StadiumFormSchema>,
  z.infer<typeof StadiumResponseSchema>,
  z.infer<typeof StadiumPopulatedSchema>
> = {
  name: "stadium",
  SCHEMA: {
    DATA: StadiumZodSchema,
    FORM: StadiumFormSchema,
    RESPONSE: StadiumResponseSchema,
    POPULATED: StadiumPopulatedSchema,
  },
  TYPE: {} as StadiumType,
  MONGO_MODEL: StadiumModel,
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
