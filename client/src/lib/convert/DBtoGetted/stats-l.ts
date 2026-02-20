import { StatsL, StatsLGet } from "../../../types/models/stats-l";
import { team } from "../CreateLabel/team";
import { match } from "../CreateLabel/match";

export const statsL = (t: StatsL): StatsLGet => {
  return {
    ...t,
    team: {
      label: team(t.team),
      id: t.team._id,
    },
    match: {
      label: match(t.match),
      id: t.match._id,
    },
  };
};
