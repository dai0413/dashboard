import { API_PATHS } from "@dai0413/myorg-shared";
import { api } from "../../context/api-context";
import { TeamMatchFormation } from "../../types/models/team-match-formation";
import { readItemsBase } from "../../lib/api";
import { convert } from "../../lib/convert/DBtoGetted";
import { ModelType } from "../../types/models";
import { FormationCounts } from "../../pages/Summary/Team/ClubTeam/types";

export const getFormationCounts = async (
  teamId: string,
  matchIds: string[],
): Promise<FormationCounts[] | undefined> => {
  const teamMatchFormationRes = await readItemsBase<TeamMatchFormation[]>({
    apiInstance: api,
    backendRoute: API_PATHS.TEAM_MATCH_FORMATION.ROOT,
    params: { getAll: true, team: teamId, match: matchIds },
  });

  if (teamMatchFormationRes?.data) {
    const formationCounts = Array.from(
      teamMatchFormationRes.data
        .reduce((map, item) => {
          const formationId = item.formation._id;

          if (!formationId) {
            return map;
          }

          const current = map.get(formationId);

          map.set(formationId, {
            ...convert(ModelType.FORMATION, item.formation),
            count: (current?.count ?? 0) + 1,
          });

          return map;
        }, new Map<string, FormationCounts>())
        .values(),
    ).sort((a, b) => b.count - a.count);

    return formationCounts;
  }
};
