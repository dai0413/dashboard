import z from "zod";
import {
  NationalMatchSeriesModel,
  INationalMatchSeries,
} from "../../server/models/national-match-series.ts";
import {
  NationalMatchSeriesZodSchema,
  NationalMatchSeriesType,
  NationalMatchSeriesFormSchema,
  NationalMatchSeriesResponseSchema,
} from "../schemas/national-match-series.schema.ts";
import { ControllerConfig } from "../../server/modelsConfig/types/type.ts";

export const nationalMatchSeries: ControllerConfig<
  INationalMatchSeries,
  NationalMatchSeriesType,
  z.infer<typeof NationalMatchSeriesFormSchema>,
  z.infer<typeof NationalMatchSeriesResponseSchema>
> = {
  name: "national-match-series",
  SCHEMA: {
    DATA: NationalMatchSeriesZodSchema,
    FORM: NationalMatchSeriesFormSchema,
    RESPONSE: NationalMatchSeriesResponseSchema,
  },
  TYPE: {} as NationalMatchSeriesType,
  MONGO_MODEL: NationalMatchSeriesModel,
  POPULATE_PATHS: [{ path: "country", collection: "countries" }],
  getALL: {
    query: [{ field: "country", type: "ObjectId" }],
    sort: { joined_at: -1, _id: -1 },
  },
  bulk: false,
  download: false,
  TEST: {
    sampleData: [
      {
        name: "親善試合14年11月",
        country: "",
        age_group: "full",
      },
    ],
    updatedData: {
      name: "updated_name",
    },
  },
};
