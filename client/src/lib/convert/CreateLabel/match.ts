import { Match } from "../../../types/models/match";

export const match = (t: Match): string => {
  return `${t.name}`;
};
