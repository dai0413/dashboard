import {
  RefereeAppearance,
  RefereeAppearanceGet,
} from "../../../types/models/referee-appearance";
import { referee } from "../CreateLabel/referee";
import { match } from "../CreateLabel/match";
import { Label } from "../../../types/types";

export const refereeAppearance = (
  t: RefereeAppearance,
): RefereeAppearanceGet => {
  let referee_obj: Label;

  if (t.referee) {
    referee_obj = { label: referee(t.referee), id: t.referee._id };
  } else {
    referee_obj = { label: t.referee_name || "", id: undefined };
  }
  return {
    ...t,
    match: {
      label: match(t.match),
      id: t.match._id,
    },
    referee: referee_obj,
  };
};
