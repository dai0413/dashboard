import z from "zod";
import { SeasonModel, ISeason } from "../../server/models/season.ts";
import {
  SeasonZodSchema,
  SeasonType,
  SeasonFormSchema,
  SeasonResponseSchema,
} from "../schemas/season.schema.ts";
import { ControllerConfig } from "../../server/modelsConfig/types/type.ts";

export const season: ControllerConfig<
  ISeason,
  SeasonType,
  z.infer<typeof SeasonFormSchema>,
  z.infer<typeof SeasonResponseSchema>
> = {
  name: "season",
  SCHEMA: {
    DATA: SeasonZodSchema,
    FORM: SeasonFormSchema,
    RESPONSE: SeasonResponseSchema,
  },
  TYPE: {} as SeasonType,
  MONGO_MODEL: SeasonModel,
  POPULATE_PATHS: [{ path: "competition", collection: "competitions" }],
  getALL: {
    sort: { _id: 1 },
  },
  bulk: false,
  download: false,
  TEST: {
    sampleData: [
      {
        competition: "68b16aa806098678a4f4af3e",
        name: "2025-0",
      },
      {
        competition: "68b16aa806098678a4f4af3e",
        name: "2025-1",
      },
      {
        competition: "68b16aa806098678a4f4af3e",
        name: "2025-2",
      },
    ],
    updatedData: {
      name: "updated_name",
    },
  },
};
