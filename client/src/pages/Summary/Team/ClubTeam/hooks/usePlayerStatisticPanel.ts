import { useCallback, useMemo, useState } from "react";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { MatchGet } from "../../../../../types/models/match";
import { FormationCounts } from "../types";
import { QuickFilterData } from "../../../../../types/table";
import {
  filterMatchesByCompetitions,
  toggleCompetition,
} from "../utils/appearancePlotPanelUtils";
import { loadPlayerStatistics } from "../utils/loadPlayerStatistics";
import { loadTeamMatches } from "../utils/loadTeamMatches";

type UsePlayerStatisticPanel = {
  reloadFun: (
    _filterConditions: FilterableFieldDefinition[],
    _sortConditions: SortableFieldDefinition[],
    teamId: string,
    date: string[],
  ) => Promise<void>;

  items: {
    quickFilterDatas: QuickFilterData[];
    playerStatistics: PlayerStatistic[];
  };

  isLoading: boolean;
};

export const usePlayerStatisticPanel = (
  teamId: string,
  date: string[],
): UsePlayerStatisticPanel => {
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
    ) => {
      setIsLoading(true);

      try {
        const { matches, competitionIds, matchIds } = await loadTeamMatches(
          teamId,
          date,
        );

        setMatches(matches);
        setSelectedCompetitions(competitionIds);

        await loadPlayerStatistics({
          teamId,
          date,
          matchIds,
          setFormationCounts,
          setPlayerStatistics,
        });
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

  const competitions = useMemo(() => {
    const competitionMap = new Map(
      matches.map((match) => [match.competition.id, match.competition]),
    );

    return [...competitionMap.values()];
  }, [matches]);

  const quickFilterDatas: QuickFilterData[] = useMemo(() => {
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
  }, [
    competitions,
    selectedCompetitions,
    formationCounts,
    handleCompetitionClick,
  ]);

  return {
    reloadFun,
    items: { playerStatistics, quickFilterDatas },
    isLoading,
  };
};
