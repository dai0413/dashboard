import { useCallback, useEffect, useState } from "react";
import {
  useSelectOption,
  useTeamCompetitionSeasonPanel,
  useCompetitionStagePanel,
  useMatchPanel,
  usePlayerRegistrationPanel,
  useStaffRegistrationPanel,
  useStatsLPanel,
  useSeasonPanel,
  usePlayerStatistics,
} from "./index";
import {
  COMPETITION_TAB,
  CompetitionTab,
  UseCompetitionSummary,
} from "../types";
import { useCompetition } from "../../../../context/models/competition";

export const useCompetitionSummary = (id: string): UseCompetitionSummary => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = useCompetition();

  const [selectedTab, setSelectedTab] = useState<CompetitionTab>(
    COMPETITION_TAB.TEAM_COMPETITION_SEASON,
  );

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as CompetitionTab);
  };

  const { selectedSeason, setSelectedSeason } = useSelectOption();
  const { competitionStages, readCompetitionStages } =
    useCompetitionStagePanel();
  const { teamCompetitionSeasons, readTeamCompetitionSeasons } =
    useTeamCompetitionSeasonPanel();
  const { matches, readMatches } = useMatchPanel();
  const { playerRegistrations, readPlayerRegistrations } =
    usePlayerRegistrationPanel();
  const { staffRegistrations, readStaffRegistrations } =
    useStaffRegistrationPanel();
  const { statsL, readStatsL } = useStatsLPanel();
  const { season, readSeason, seasonOptions } = useSeasonPanel();
  const { playerStatistics, readPlayerStatistics } = usePlayerStatistics();

  // id変更, season変更両方で読み込む
  const readDatas = async (competitionId: string, seasonId: string) => {
    await Promise.all([
      readCompetitionStages(competitionId, seasonId),
      readTeamCompetitionSeasons(competitionId, seasonId),
      readMatches(seasonId),
      readPlayerRegistrations(seasonId),
      readStaffRegistrations(seasonId),
      readStatsL(seasonId),
      readSeason(competitionId),
      readPlayerStatistics(seasonId),
    ]);
  };

  // id変更で読み込む
  const onChangeId = async (competitionId: string) => {
    const newSeasons = await readSeason(competitionId);

    if (!newSeasons) return;

    const current = newSeasons.find((s) => s.current);
    let newSelectedSeason = current ? current : newSeasons[0];
    setSelectedSeason(newSelectedSeason);

    readDatas(competitionId, newSelectedSeason._id);
  };

  // season選択で読み込む
  const handleSetSelectedSeason = useCallback(
    (seasonId: string | number | Date | undefined) => {
      const newSelectedSeason =
        season.data.find((s) => s._id === seasonId) ?? null;
      setSelectedSeason(newSelectedSeason);

      if (!newSelectedSeason) return;

      readDatas(id, newSelectedSeason._id);
    },
    [id, season],
  );

  useEffect(() => {
    if (!id) return;
    (async () => {
      await readItem(id);
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      if (id) {
        await onChangeId(id);
      }
    })();
  }, [selected]);

  return {
    id,
    isLoading,
    selected,

    select: {
      selectedOption: selectedSeason,
      options: seasonOptions,
      handleSelect: handleSetSelectedSeason,
    },

    tab: {
      selectedTab,
      handleSelect: handleSelectedTab,
    },

    panels: {
      competitionStage: {
        key: `${selectedTab}-${selectedSeason?._id}`,
        items: competitionStages.data,
        reloadFun: async () => readCompetitionStages(id, selectedSeason?._id),
      },

      teamCompetitionSeason: {
        key: `${selectedTab}-${selectedSeason?._id}`,
        items: teamCompetitionSeasons.data,
        reloadFun: async () =>
          readTeamCompetitionSeasons(id, selectedSeason?._id),
      },

      match: {
        key: `${selectedTab}-${selectedSeason?._id}`,
        items: matches.data,
        reloadFun: async () => readMatches(selectedSeason?._id),
      },

      playerRegistration: {
        key: `${selectedTab}-${selectedSeason?._id}`,
        items: playerRegistrations.data,
        reloadFun: async () => readPlayerRegistrations(selectedSeason?._id),
      },

      staffRegistration: {
        key: `${selectedTab}-${selectedSeason?._id}`,
        items: staffRegistrations.data,
        reloadFun: async () => readStaffRegistrations(selectedSeason?._id),
      },

      season: {
        key: `${selectedTab}-${id}`,
        items: season.data,
        reloadFun: async () => {
          readSeason(id);
        },
      },

      statsL: {
        key: `${selectedTab}-${selectedSeason?._id}`,
        items: statsL.items,
        reloadFun: async () => readStatsL(selectedSeason?._id),
        isLoading: statsL.isLoading,
      },

      playerStatistics: {
        key: `${selectedTab}-${selectedSeason?._id}`,
        items: playerStatistics.data,
        isLoading: playerStatistics.isLoading,
        reloadFun: async () => readPlayerStatistics(selectedSeason?._id),
      },
    },
  };
};
