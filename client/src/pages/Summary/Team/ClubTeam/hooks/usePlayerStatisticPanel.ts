import { useCallback, useMemo, useState } from "react";
import {
  API_PATHS,
  FilterableFieldDefinition,
  SortableFieldDefinition,
  sortByPosition,
} from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { api } from "../../../../../context/api-context";
import { ModelType } from "../../../../../types/models";
import { createItemBase, readItemsBase } from "../../../../../lib/api";
import {
  PlayerAppearance,
  PlayerAppearanceGet,
} from "../../../../../types/models/player-appearance";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { Match, MatchGet } from "../../../../../types/models/match";
import { PlayerRegistration } from "../../../../../types/models/player-registration";
import { FormationCounts } from "../types";
import { getFormationCounts } from "../../../../../utils/data";
import { QuickFilterData } from "../../../../../types/table";
import {
  convertPlayerStatistics,
  createPlayerStatisticsParams,
  filterMatchesByCompetitions,
  toggleCompetition,
} from "../utils/appearancePlotPanelUtils";

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

  const loadPlayerStatistics = useCallback(
    async (teamId: string, date: string[], matchIds: string[]) => {
      // フォーメーション集計
      const formationCounts = await getFormationCounts(teamId, matchIds);
      setFormationCounts(formationCounts ?? []);

      // 出場記録
      let newPlayerAppearance: PlayerAppearanceGet[] = [];

      if (matchIds.length > 0) {
        const playerAppearanceRes = await readItemsBase<PlayerAppearance[]>({
          apiInstance: api,
          backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
          params: { getAll: true, team: teamId, match: matchIds },
        });

        if (playerAppearanceRes?.data) {
          newPlayerAppearance = convert(
            ModelType.PLAYER_APPEARANCE,
            playerAppearanceRes.data,
          );
        }
      }

      // 登録情報
      const playerRegistrationRes = await readItemsBase<PlayerRegistration[]>({
        apiInstance: api,
        backendRoute: API_PATHS.PLAYER_REGISTRATION.ROOT,
        params: { getAll: true, team: teamId, date },
      });

      const newPlayerRegistrations = playerRegistrationRes?.data
        ? convert(ModelType.PLAYER_REGISTRATION, playerRegistrationRes.data)
        : [];

      const params = createPlayerStatisticsParams(
        newPlayerAppearance,
        newPlayerRegistrations,
        teamId,
        matchIds,
      );

      // 選手統計
      const playerStatistic = await createItemBase<PlayerStatistic[]>({
        apiInstance: api,
        backendRoute: API_PATHS.AGGREGATE.PLAYER.STATISTICS,
        data: params,
      });

      if (!playerStatistic?.success) return;

      const players = convertPlayerStatistics(
        playerStatistic.data,
        newPlayerRegistrations,
        date,
      );

      setPlayerStatistics(sortByPosition(players, "mainPosition"));
    },
    [teamId, date],
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
        const matchRes = await readItemsBase<Match[]>({
          apiInstance: api,
          backendRoute: API_PATHS.MATCH.ROOT,
          params: { getAll: true, team: teamId, date },
        });

        const rawMatches = matchRes?.data ?? [];
        const newMatches = convert(ModelType.MATCH, rawMatches);

        setMatches(newMatches);

        const competitions = new Map(
          rawMatches.map((match) => {
            const competition = convert(
              ModelType.COMPETITION,
              match.competition,
            );

            return [competition._id, competition];
          }),
        );

        const newCompetitions = [...competitions.values()];

        setSelectedCompetitions(newCompetitions.map((c) => c._id));

        const matchIds = [...new Set(rawMatches.map((m) => m._id))];

        await loadPlayerStatistics(teamId, date, matchIds);
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
        await loadPlayerStatistics(
          teamId,
          date,
          filtered.map((match) => match._id),
        );
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
