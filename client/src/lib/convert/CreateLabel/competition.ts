import { Competition } from "../../../types/models/competition";

export const competition = (t: Competition): string => {
  return t.abbr || t.name;
};
