import z from "zod";
import {
  NationalMatchSeriesModel,
  INationalMatchSeries,
} from "../mongose/national-match-series";
import {
  NationalMatchSeriesZodSchema,
  NationalMatchSeriesType,
  NationalMatchSeriesFormSchema,
  NationalMatchSeriesResponseSchema,
  NationalMatchSeriesPopulatedSchema,
} from "../schemas/national-match-series.schema";
import { ControllerConfig, DependencyRefs } from "../types";

export const nationalMatchSeries: ControllerConfig<
  INationalMatchSeries,
  NationalMatchSeriesType,
  z.infer<typeof NationalMatchSeriesFormSchema>,
  z.infer<typeof NationalMatchSeriesResponseSchema>,
  z.infer<typeof NationalMatchSeriesPopulatedSchema>
> = {
  name: "national-match-series",
  SCHEMA: {
    DATA: NationalMatchSeriesZodSchema,
    FORM: NationalMatchSeriesFormSchema,
    RESPONSE: NationalMatchSeriesResponseSchema,
    POPULATED: NationalMatchSeriesPopulatedSchema,
  },
  TYPE: {} as NationalMatchSeriesType,
  MONGO_MODEL: NationalMatchSeriesModel,
  POPULATE_PATHS: [{ path: "country", collection: "countries" }],
  getAllConfig: {
    query: [{ field: "country", type: "ObjectId" }],
    sort: { joined_at: -1, _id: -1 },
  },
  bulk: false,
  download: true,
  TEST: {
    sampleData: (deps: DependencyRefs) => [
      {
        name: "親善試合14年11月",
        country: deps.country._id,
        age_group: "full",
      },
    ],
    updatedData: {
      name: "updated_name",
    },
  },
};
