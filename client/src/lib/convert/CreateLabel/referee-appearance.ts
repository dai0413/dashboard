import { RefereeAppearance } from "../../../types/models/referee-appearance";

export const refereeAppearance = (t: RefereeAppearance): string => {
  return `${t.match}-${t.referee}`;
};
