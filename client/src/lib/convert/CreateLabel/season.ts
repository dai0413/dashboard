import { Season } from "../../../types/models/season";
import { competition } from "./competition";

export const season = (t: Season): string => {
  return `${competition(t.competition)}-${t.name}`;
};
