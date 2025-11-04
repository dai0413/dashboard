import { Season, SeasonGet } from "../../../types/models/season";
import { competition } from "../CreateLabel/competition";

function getStatus(isCurrent: boolean | null | undefined): string | null {
  if (isCurrent === true) return "最新";
  if (isCurrent === false) return "";
  return null;
}

export const season = (t: Season): SeasonGet => {
  return {
    ...t,
    competition: {
      label: competition(t.competition),
      id: t.competition._id,
    },
    current: getStatus(t.current),
  };
};
