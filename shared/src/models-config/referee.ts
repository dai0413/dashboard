import z from "zod";
import { RefereeModel, IReferee } from "../mongose/referee";
import {
  RefereeZodSchema,
  RefereeType,
  RefereeFormSchema,
  RefereeResponseSchema,
  RefereePopulatedSchema,
} from "../schemas/referee.schema";
import { ControllerConfig } from "../types";

export const referee: ControllerConfig<
  IReferee,
  RefereeType,
  z.infer<typeof RefereeFormSchema>,
  z.infer<typeof RefereeResponseSchema>,
  z.infer<typeof RefereePopulatedSchema>
> = {
  name: "referee",
  SCHEMA: {
    DATA: RefereeZodSchema,
    FORM: RefereeFormSchema,
    RESPONSE: RefereeResponseSchema,
    POPULATED: RefereePopulatedSchema,
  },
  TYPE: {} as RefereeType,
  MONGO_MODEL: RefereeModel,
  POPULATE_PATHS: [
    { path: "citizenship", collection: "countries" },
    { path: "player", collection: "players" },
  ],
  getAllConfig: {
    sort: { _id: 1 },
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
