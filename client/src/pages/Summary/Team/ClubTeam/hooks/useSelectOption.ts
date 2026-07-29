import { useState } from "react";
import { TeamCompetitionSeason } from "../../../../../types/models/team-competition-season";
import { SeasonDates } from "../../../../../types/seasonDates";

export const useSelectOption = () => {
  const [selectedteamCompetitionSeason, setSelectedTeamCompetitionSeason] =
    useState<TeamCompetitionSeason | null>(null);

  const [seasonDates, setSeasonDates] = useState<{
    normalSeason: SeasonDates;
    transferWindow: SeasonDates;
    future: SeasonDates;
  }>({
    normalSeason: {
      startDate: undefined,
      endDate: undefined,
      seasonRange: [],
    },
    transferWindow: {
      startDate: undefined,
      endDate: undefined,
      seasonRange: [],
    },
    future: {
      startDate: undefined,
      endDate: undefined,
      seasonRange: [],
    },
  });

  return {
    seasonDates,
    setSelectedTeamCompetitionSeason,
    selectedteamCompetitionSeason,
    setSeasonDates,
  };
};
