import { API_PATHS } from "@dai0413/myorg-shared";
import { api } from "../../../../../context/api-context";
import { readItemsBase } from "../../../../../lib/api";
import { Match, MatchGet } from "../../../../../types/models/match";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { ModelType } from "../../../../../types/models";

export const loadTeamMatches = async (
  teamId: string,
  date: string[],
): Promise<{
  matches: MatchGet[];
  competitionIds: string[];
  matchIds: string[];
}> => {
  const matchRes = await readItemsBase<Match[]>({
    apiInstance: api,
    backendRoute: API_PATHS.MATCH.ROOT,
    params: { getAll: true, team: teamId, date },
  });

  const rawMatches = matchRes?.data ?? [];
  const matches = convert(ModelType.MATCH, rawMatches);

  const competitions = new Map(
    rawMatches.map((match) => {
      const competition = convert(ModelType.COMPETITION, match.competition);

      return [competition._id, competition];
    }),
  );

  return {
    matches,
    competitionIds: [...competitions.keys()],
    matchIds: [...new Set(rawMatches.map((match) => match._id))],
  };
};
