import { MatchGet } from "../../../../../types/models/match";

export const createMatchLabel = (match: MatchGet, teamId: string): string => {
  const isHome = match.home_team.id === teamId;
  const vsTeam = isHome ? match.away_team : match.home_team;

  const parts = [
    match.competition.label,
    match.competition_stage?.label,
    match.match_week != null ? `${match.match_week}節` : undefined,
    `vs${vsTeam.label}`,
  ].filter(Boolean);

  return parts.join("-");
};
