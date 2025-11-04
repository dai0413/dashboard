import { Stadium, StadiumGet } from "../../../types/models/stadium";
import { country } from "../CreateLabel/country";

export const stadium = (t: Stadium): StadiumGet => {
  return {
    ...t,
    country: {
      label: country(t.country),
      id: t.country?._id,
    },
  };
};
