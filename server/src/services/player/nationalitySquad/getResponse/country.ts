import { country } from "@dai0413/myorg-shared/models-config";
import { CountryModel } from "../../../../models/country.js";
import z from "zod";
import { getResponseData } from "../../../../utils/getResponseData.js";
import { NationalitySquadResult } from "@dai0413/myorg-shared/types/aggregate/player";

const {
  SCHEMA: countrySchema,
  POPULATE_PATHS: countryPopulatePaths,
  convertFun: countryConvertFun,
} = country();
type Response = z.infer<typeof countrySchema.RESPONSE>;
type Populated = z.infer<typeof countrySchema.POPULATED>;

export const getCountryResponse = async (result: NationalitySquadResult[]) => {
  const populated = await CountryModel.populate<Populated>(
    result.map((item) => item.country),
    countryPopulatePaths,
  );

  const response: Response[] = populated.map((item) => {
    return getResponseData({
      populated: item,
      SCHEMA: countrySchema,
      convertFun: countryConvertFun,
    });
  });

  return response;
};
