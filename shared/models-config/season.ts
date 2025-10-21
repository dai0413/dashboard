import z from "zod";
import { SeasonModel, ISeason } from "../../server/models/season.ts";
import {
  SeasonZodSchema,
  SeasonType,
  SeasonFormSchema,
  SeasonResponseSchema,
  SeasonPopulatedSchema,
} from "../schemas/season.schema.ts";
import { ControllerConfig } from "../../server/modelsConfig/types/type.ts";

export const season: ControllerConfig<
  ISeason,
  SeasonType,
  z.infer<typeof SeasonFormSchema>,
  z.infer<typeof SeasonResponseSchema>,
  z.infer<typeof SeasonPopulatedSchema>
> = {
  name: "season",
  SCHEMA: {
    DATA: SeasonZodSchema,
    FORM: SeasonFormSchema,
    RESPONSE: SeasonResponseSchema,
    POPULATED: SeasonPopulatedSchema,
  },
  TYPE: {} as SeasonType,
  MONGO_MODEL: SeasonModel,
  POPULATE_PATHS: [{ path: "competition", collection: "competitions" }],
  getAllConfig: {
    query: [
      { field: "competition", type: "ObjectId" },
      { field: "current", type: "Boolean" },
    ],
    sort: { start_date: -1, _id: -1 },
  },
  bulk: false,
  download: false,
  TEST: {
    sampleData: (deps) => [
      {
        competition: deps.competition._id,
        name: "2025-0",
      },
      {
        competition: deps.competition._id,
        name: "2025-1",
      },
      {
        competition: deps.competition._id,
        name: "2025-2",
      },
    ],
    updatedData: {
      name: "updated_name",
    },
  },
};
