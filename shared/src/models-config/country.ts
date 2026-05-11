import {
  CountryZodSchema,
  CountryFormSchema,
  CountryResponseSchema,
  CountryPopulatedSchema,
} from "../schemas/country.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function country<TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>,
): ControllerConfig<
  typeof CountryZodSchema,
  typeof CountryFormSchema,
  typeof CountryResponseSchema,
  typeof CountryPopulatedSchema
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "country",
    collection_name: "countries",
    SCHEMA: {
      DATA: CountryZodSchema,
      FORM: CountryFormSchema,
      RESPONSE: CountryResponseSchema,
      POPULATED: CountryPopulatedSchema,
    },
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [],
    getAllConfig: {
      sort: { _id: 1 },
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
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
}
