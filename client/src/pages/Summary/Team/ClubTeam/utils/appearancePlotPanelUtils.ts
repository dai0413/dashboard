import { QueryParams, sortByPosition } from "@dai0413/myorg-shared";
import { MatchGet } from "../../../../../types/models/match";
import { PlayerRegistrationGet } from "../../../../../types/models/player-registration";
import { PlayerAppearanceGet } from "../../../../../types/models/player-appearance";
import { getAgeLabel } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/utils";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";

export const convertPlayerStatistics = (
  playerStatistics: PlayerStatistic[],
  playerRegistrations: PlayerRegistrationGet[],
  date: string[],
) => {
  const players = playerStatistics.map((statistic) => {
    const targetRegister = playerRegistrations.find(
      (p) => p.player.id === statistic.player._id,
    );

    let note: string | undefined;

    if (targetRegister?.isTypeTwo) note = "2種";
    if (targetRegister?.isSpecialDesignation) note = "特指";

    return {
      ...statistic,
      ageLabel: statistic.player.dob
        ? getAgeLabel(
            new Date(statistic.player.dob),
            new Date(date[0]),
            new Date(date[1]),
          )
        : undefined,
      note,
    };
  });

  return sortByPosition(players, "mainPosition");
};

export const createPlayerStatisticsParams = (
  playerAppearance: PlayerAppearanceGet[],
  playerRegistrations: PlayerRegistrationGet[],
  teamId: string,
  matchIds: string[],
): QueryParams => {
  const playerIds: string[] = [
    ...new Set(
      [
        ...playerAppearance.map((p) => p.player.id),
        ...playerRegistrations.map((p) => p.player.id),
      ].filter((p) => typeof p === "string"),
    ),
  ];

  const params: QueryParams = {
    player: playerIds,
    team: teamId,
    match: matchIds,
  };

  if (matchIds.length > 0) {
    params["_id"] = matchIds;
  }

  return params;
};

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
