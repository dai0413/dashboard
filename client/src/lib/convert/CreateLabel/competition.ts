import { Competition } from "../../../types/models/competition";

export const competition = (t: Competition): string => {
  if (t.abbr) return t.abbr;
  return t.name;
};
