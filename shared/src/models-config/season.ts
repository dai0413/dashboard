import {
  SeasonZodSchema,
  SeasonFormSchema,
  SeasonResponseSchema,
  SeasonPopulatedSchema,
} from "../schemas/season.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function season<TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>,
): ControllerConfig<
  typeof SeasonZodSchema,
  typeof SeasonFormSchema,
  typeof SeasonResponseSchema,
  typeof SeasonPopulatedSchema
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "season",
    collection_name: "seasons",
    SCHEMA: {
      DATA: SeasonZodSchema,
      FORM: SeasonFormSchema,
      RESPONSE: SeasonResponseSchema,
      POPULATED: SeasonPopulatedSchema,
    },
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [{ path: "competition", collection: "competitions" }],
    getAllConfig: {
      query: [
        { field: "competition", type: "ObjectId" },
        { field: "current", type: "Boolean" },
        { field: "start_date", type: "Date" },
        { field: "end_date", type: "Date" },
      ],
      sort: { start_date: -1, _id: -1 },
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
    download: false,
    TEST: {
      sampleData: (deps) => [
        {
          competition: deps.competition[0]._id,
          name: "2025-0",
        },
        {
          competition: deps.competition[0]._id,
          name: "2025-1",
        },
        {
          competition: deps.competition[0]._id,
          name: "2025-2",
        },
      ],
      updatedData: {
        name: "updated_name",
      },
    },
  };
}
