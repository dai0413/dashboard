import { useCallback, useMemo, useState } from "react";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player";
import { MatchGet } from "../../../../../types/models/match";
import { FormationCounts, PlayerStatisticsData } from "../types";
import { QuickFilterData } from "../../../../../types/table";
import {
  filterMatchesByCompetitions,
  toggleCompetition,
} from "../utils/appearancePlotPanelUtils";
import { loadPlayerStatistics } from "../utils/loadPlayerStatistics";
import { loadTeamMatches } from "../utils/loadTeamMatches";

export const usePlayerStatisticPanel = (teamId: string, date: string[]) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [matches, setMatches] = useState<MatchGet[]>([]);
  const [playerStatistics, setPlayerStatistics] = useState<PlayerStatistic[]>(
    [],
  );
  const [formationCounts, setFormationCounts] = useState<FormationCounts[]>([]);

  const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>(
    [],
  );

  const reloadFun = useCallback(
    async (
      _filterConditions: FilterableFieldDefinition[],
      _sortConditions: SortableFieldDefinition[],
      teamId: string,
      date: string[],
    ): Promise<PlayerStatisticsData | null> => {
      setIsLoading(true);

      try {
        const { matches, competitionIds, matchIds } = await loadTeamMatches(
          teamId,
          date,
        );

        setMatches(matches);
        setSelectedCompetitions(competitionIds);

        const values = await loadPlayerStatistics({
          teamId,
          date,
          matchIds,
          setFormationCounts,
          setPlayerStatistics,
        });

        if (!values.formationCounts || !values.playerStatistics) return null;

        const playerStatisticsData: PlayerStatisticsData = {
          isLoading: false,
          matches,
          playerStatistics: values.playerStatistics,
          formationCounts: values.formationCounts,
          selectedCompetitions: competitionIds,
        };

        return playerStatisticsData;
      } finally {
        setIsLoading(false);
      }
    },
    [loadPlayerStatistics],
  );

  const handleCompetitionClick = useCallback(
    async (competitionId: string) => {
      const competitionIds = toggleCompetition(
        selectedCompetitions,
        competitionId,
      );

      setSelectedCompetitions(competitionIds);

      const filtered = filterMatchesByCompetitions(matches, competitionIds);

      if (!teamId || !date) return;

      setIsLoading(true);

      try {
        await loadPlayerStatistics({
          teamId,
          date,
          matchIds: filtered.map((match) => match._id),
          setFormationCounts,
          setPlayerStatistics,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCompetitions, matches],
  );

  const quickFilterDatas: QuickFilterData[] = useMemo(() => {
    const competitionMap = new Map(
      matches.map((match) => [match.competition.id, match.competition]),
    );

    const competitions = [...competitionMap.values()];

    const competitionFilter: QuickFilterData = {
      name: "competitions",
      multi: true,
      selectedKeys: selectedCompetitions,
      items: competitions.map((competition) => ({
        key: competition.id || "",
        label: competition.label,
        onClick: () => competition.id && handleCompetitionClick(competition.id),
      })),
    };

    return [competitionFilter];
  }, [matches, selectedCompetitions, formationCounts, handleCompetitionClick]);

  const restore = ({
    isLoading,
    matches,
    playerStatistics,
    formationCounts,
    selectedCompetitions,
  }: PlayerStatisticsData) => {
    setIsLoading(isLoading);
    setMatches(matches);
    setPlayerStatistics(playerStatistics);
    setFormationCounts(formationCounts);
    setSelectedCompetitions(selectedCompetitions);
  };

  return {
    reloadFun,
    items: { playerStatistics, quickFilterDatas },
    isLoading,
    restore,
  };
};
