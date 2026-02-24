import {
  RefereeAppearanceForm,
  RefereeAppearanceGet,
} from "../../../types/models/referee-appearance";

export const refereeAppearance = (
  t: RefereeAppearanceGet,
): RefereeAppearanceForm => {
  const referee_name = t.referee && !t.referee.id ? t.referee.label : undefined;

  return {
    ...t,
    match: t.match.id,
    referee: t.referee.id ? t.referee.id : undefined,
    referee_name,
  };
};
