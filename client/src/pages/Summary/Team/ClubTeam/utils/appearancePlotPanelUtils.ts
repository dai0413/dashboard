import { MatchGet } from "../../../../../types/models/match";

export const createTopHeaderText = (date: string[]): string => {
  if (date.length !== 2) return "";

  return `${date[0].replace(">=", "")} → ${date[1].replace("<=", "")}`;
};

export const toggleCompetition = (
  selectedIds: string[],
  competitionId: string,
): string[] => {
  return selectedIds.includes(competitionId)
    ? selectedIds.filter((id) => id !== competitionId)
    : [...selectedIds, competitionId];
};

export const filterMatchesByCompetitions = (
  matches: MatchGet[],
  competitionIds: string[],
): MatchGet[] => {
  if (competitionIds.length === 0) return matches;

  return matches.filter(
    (match) =>
      match.competition.id && competitionIds.includes(match.competition.id),
  );
};
