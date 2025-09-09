import { StadiumForm, StadiumGet } from "../../../types/models/stadium";

export const stadium = (t: StadiumGet): StadiumForm => ({
  ...t,
  country: t.country.id,
});
