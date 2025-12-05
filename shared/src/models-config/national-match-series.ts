import z from "zod";
import {
  NationalMatchSeriesZodSchema,
  NationalMatchSeriesType,
  NationalMatchSeriesFormSchema,
  NationalMatchSeriesResponseSchema,
  NationalMatchSeriesPopulatedSchema,
} from "../schemas/national-match-series.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function nationalMatchSeries<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>
): ControllerConfig<
  TDoc,
  NationalMatchSeriesType,
  z.infer<typeof NationalMatchSeriesFormSchema>,
  z.infer<typeof NationalMatchSeriesResponseSchema>,
  z.infer<typeof NationalMatchSeriesPopulatedSchema>
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
    TYPE: {} as NationalMatchSeriesType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [{ path: "country", collection: "countries" }],
    getAllConfig: {
      query: [{ field: "country", type: "ObjectId" }],
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
            age_group: "full",
          },
          {
            name: "親善試合14年12月",
            country: deps.country[0]._id,
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
