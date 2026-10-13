import { API_PATHS, QueryParams } from "@dai0413/myorg-shared";
import { readItemsBase } from "../../../../../lib/api";
import { TeamMatchFormation } from "../../../../../types/models/team-match-formation";
import { api } from "../../../../../context/api-context";
import { Formation } from "../../../../../types/models/formation";

type LoadFormationDataParams = {
  teamId: string;
  matchIds: string[];
  competitions?: string[];
  formation?: string;
};

export const loadFormationData = async ({
  teamId,
  matchIds,
  competitions,
  formation,
}: LoadFormationDataParams): Promise<string[]> => {
  const params: QueryParams = {
    getAll: true,
    team: teamId,
    match: matchIds,
  };

  if (competitions?.length) {
    params.competition = competitions;
  }

  if (formation) {
    params.formation = formation;
  }

  const res = await readItemsBase<TeamMatchFormation[]>({
    apiInstance: api,
    backendRoute: API_PATHS.TEAM_MATCH_FORMATION.ROOT,
    params,
  });

  if (!res?.data?.length) return [];

  return res.data.map((item) => item.match._id);
};

export const loadFormationByName = async (
  name: string,
): Promise<Formation | undefined> => {
  const res = await readItemsBase<Formation[]>({
    apiInstance: api,
    backendRoute: API_PATHS.FORMATION.ROOT,
    params: { name },
  });

  if (!res?.data || res.data.length !== 1) return undefined;

  return res.data[0];
};
