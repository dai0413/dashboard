import {
  NationalMatchSeriesZodSchema,
  NationalMatchSeriesFormSchema,
  NationalMatchSeriesResponseSchema,
  NationalMatchSeriesPopulatedSchema,
} from "../schemas/national-match-series.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function nationalMatchSeries<TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>,
): ControllerConfig<
  typeof NationalMatchSeriesZodSchema,
  typeof NationalMatchSeriesFormSchema,
  typeof NationalMatchSeriesResponseSchema,
  typeof NationalMatchSeriesPopulatedSchema
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "national-match-series",
    collection_name: "nationalmatchseries",
    SCHEMA: {
      DATA: NationalMatchSeriesZodSchema,
      FORM: NationalMatchSeriesFormSchema,
      RESPONSE: NationalMatchSeriesResponseSchema,
      POPULATED: NationalMatchSeriesPopulatedSchema,
    },
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "country", collection: "countries" },
      { path: "team", collection: "teams" },
      { path: "matches", collection: "matches", isArray: true },
    ],
    getAllConfig: {
      query: [
        { field: "country", type: "ObjectId" },
        { field: "team", type: "ObjectId" },
        { field: "joined_at", type: "Date" },
        { field: "left_at", type: "Date" },
        { field: "age_group", type: "String" },
        { field: "matches", type: "ObjectId", isArray: true },
      ],
      sort: { joined_at: -1, _id: -1 },
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
    download: true,
    TEST: {
      sampleData: (deps) => {
        return [
          {
            name: "親善試合14年11月",
            country: deps.country[0]._id,
            team: deps.team[0]._id,
            age_group: "full",
          },
          {
            name: "親善試合14年12月",
            country: deps.country[0]._id,
            team: deps.team[0]._id,
            age_group: "full",
          },
        ];
      },
      updatedData: {
        name: "updated_name",
      },
    },
  };
}
