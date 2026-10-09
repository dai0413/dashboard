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
import {
  PlayerRegistration,
  PlayerRegistrationGet,
} from "../../../../../types/models/player-registration";
import { FormationCounts } from "../types";
import { getFormationCounts } from "../../../../../utils/data";
import { getGroupedPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/MatchMatrix/utils";
import { createGroupedPlayers } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/utils";
import { displayPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/context/displayPositions";
import { QuickFilterData } from "../../../../../types/table";
import { GroupedPlayers } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/type";
import {
  convertPlayerStatistics,
  createPlayerStatisticsParams,
  createTopHeaderText,
  filterMatchesByCompetitions,
  toggleCompetition,
} from "../utils/appearancePlotPanelUtils";

type UseAppearancePlotPanel = {
  reloadFun: (
    _filterConditions: FilterableFieldDefinition[],
    _sortConditions: SortableFieldDefinition[],
    teamId: string,
    date: string[],
  ) => Promise<void>;

  items: {
    topHeaderText: string;
    playerRegistrations: PlayerRegistrationGet[];
    matches: MatchGet[];
    playerAppearance: PlayerAppearanceGet[];
    defaultOpenPositions: Set<string>;
    groupedPlayers: GroupedPlayers[];
    quickFilterDatas: QuickFilterData[];

    playerStatistics: PlayerStatistic[];
  };

  isLoading: boolean;
};

export const useAppearancePlotPanel = (
  teamId: string,
  date: string[],
): UseAppearancePlotPanel => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [playerAppearance, setPlayerAppearance] = useState<
    PlayerAppearanceGet[]
  >([]);
  const [playerRegistrations, setPlayerRegistrations] = useState<
    PlayerRegistrationGet[]
  >([]);
  const [matches, setMatches] = useState<MatchGet[]>([]);
  const [playerStatistics, setPlayerStatistics] = useState<PlayerStatistic[]>(
    [],
  );
  const [formationCounts, setFormationCounts] = useState<FormationCounts[]>([]);

  const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>(
    [],
  );
  const [selectedFormation, setSelectedFormation] = useState<
    string | undefined
  >(undefined);

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

      setPlayerAppearance(newPlayerAppearance);

      // 登録情報
      const playerRegistrationRes = await readItemsBase<PlayerRegistration[]>({
        apiInstance: api,
        backendRoute: API_PATHS.PLAYER_REGISTRATION.ROOT,
        params: { getAll: true, team: teamId, date },
      });

      const newPlayerRegistrations = playerRegistrationRes?.data
        ? convert(ModelType.PLAYER_REGISTRATION, playerRegistrationRes.data)
        : [];

      setPlayerRegistrations(newPlayerRegistrations);

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

  const filteredMatches = useMemo(
    () => filterMatchesByCompetitions(matches, selectedCompetitions),
    [matches, selectedCompetitions],
  );

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

    const formationFilter: QuickFilterData = {
      name: "formations",
      selectedKeys: selectedFormation ? [selectedFormation] : undefined,
      items: formationCounts.map((formationCount) => ({
        key: formationCount.key,
        label: `${formationCount.name} (${formationCount.count})`,
        onClick: () => {
          setSelectedFormation(formationCount.key);
        },
      })),
    };

    return [competitionFilter, formationFilter];
  }, [
    competitions,
    selectedCompetitions,
    selectedFormation,
    formationCounts,
    handleCompetitionClick,
  ]);

  const { groupedPlayers, defaultOpenPositions, topHeaderText } =
    useMemo(() => {
      const positionByFormation = formationCounts.find(
        (formation) => formation.key === selectedFormation,
      )?.position_formation;

      const positions =
        positionByFormation ?? displayPositions.map((position) => position.key);

      const positionOptions = getGroupedPositions(positions);

      return {
        groupedPlayers: createGroupedPlayers(playerStatistics, positionOptions),
        defaultOpenPositions: new Set(positions),
        topHeaderText: createTopHeaderText(date),
      };
    }, [
      playerStatistics,
      formationCounts,
      selectedFormation,
      displayPositions,
      date,
    ]);

  return {
    reloadFun,
    items: {
      topHeaderText,
      playerRegistrations,
      matches: filteredMatches,
      playerAppearance,
      defaultOpenPositions,
      groupedPlayers,
      quickFilterDatas,

      playerStatistics,
    },
    isLoading,
  };
};
