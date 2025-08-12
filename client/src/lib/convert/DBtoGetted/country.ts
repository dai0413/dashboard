import { Country, CountryGet } from "../../../types/models/country";

export const country = (t: Country): CountryGet => ({
  ...t,
});
