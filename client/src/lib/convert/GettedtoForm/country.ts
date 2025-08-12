import { CountryForm, CountryGet } from "../../../types/models/country";

export const country = (t: CountryGet): CountryForm => {
  return {
    ...t,
  };
};
