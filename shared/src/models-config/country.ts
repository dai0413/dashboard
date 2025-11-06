import z from "zod";
import { CountryModel, ICountry } from "../mongose/country";
import {
  CountryZodSchema,
  CountryType,
  CountryFormSchema,
  CountryResponseSchema,
  CountryPopulatedSchema,
} from "../schemas/country.schema";
import { ControllerConfig } from "../types";

export const country: ControllerConfig<
  ICountry,
  CountryType,
  z.infer<typeof CountryFormSchema>,
  z.infer<typeof CountryResponseSchema>,
  z.infer<typeof CountryPopulatedSchema>
> = {
  name: "country",
  SCHEMA: {
    DATA: CountryZodSchema,
    FORM: CountryFormSchema,
    RESPONSE: CountryResponseSchema,
    POPULATED: CountryPopulatedSchema,
  },
  TYPE: {} as CountryType,
  MONGO_MODEL: CountryModel,
  POPULATE_PATHS: [],
  getAllConfig: {
    sort: { _id: 1 },
  },
  bulk: false,
  download: false,
  TEST: {
    sampleData: [
      {
        name: "アフガニスタン",
        en_name: "Afghanistan",
        iso3: "AFG",
        fifa_code: "AFG",
        area: "アジア",
        district: "中央アジア",
        confederation: "AFC",
        sub_confederation: "CAFA",
        established_year: 1933,
        association_member_year: 1954,
      },
    ],
    updatedData: {
      name: "updated_name",
    },
  },
};
