import {
  TeamMatchFormation,
  TeamMatchFormationGet,
} from "../../../types/models/team-match-formation";
import { team } from "../CreateLabel/team";
import { match } from "../CreateLabel/match";
import { formation } from "../CreateLabel/formation";

export const teamMatchFormation = (
  t: TeamMatchFormation,
): TeamMatchFormationGet => {
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
    formation: {
      label: formation(t.formation),
      id: t.formation._id,
    },
  };
};
