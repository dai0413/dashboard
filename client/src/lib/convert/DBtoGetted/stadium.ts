import { Stadium, StadiumGet } from "../../../types/models/stadium";

export const stadium = (t: Stadium): StadiumGet => {
  return {
    ...t,
    country: {
      label: t.country?.name ?? "不明",
      id: t.country?._id ?? "",
    },
  };
};
