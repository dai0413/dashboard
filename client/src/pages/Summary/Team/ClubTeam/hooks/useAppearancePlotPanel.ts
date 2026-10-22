import { useCallback, useMemo, useState } from "react";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player";
import { PlayerAppearanceGet } from "../../../../../types/models/player-appearance";
import { MatchGet } from "../../../../../types/models/match";
import { PlayerRegistrationGet } from "../../../../../types/models/player-registration";
import { FormationCounts } from "../types";
import { getGroupedPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/MatchMatrix/utils";
import { createGroupedPlayers } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/utils";
import { displayPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/context/displayPositions";
import { QuickFilterData } from "../../../../../types/table";
import { GroupedPlayers } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/type";
import {
  createTopHeaderText,
  filterMatchesByCompetitions,
  toggleCompetition,
} from "../utils/appearancePlotPanelUtils";
import { loadPlayerStatistics } from "../utils/loadPlayerStatistics";
import { loadTeamMatches } from "../utils/loadTeamMatches";

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
  const [selectedFormation, setSelectedFormation] = useState<string | "BASE">(
    "BASE",
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
          setPlayerAppearance,
          setPlayerRegistrations,
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
          setPlayerAppearance,
          setPlayerRegistrations,
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

    const formationFIlterItems = formationCounts.map((formationCount) => ({
      key: formationCount.key,
      label: `${formationCount.name} (${formationCount.count})`,
      onClick: () => {
        setSelectedFormation(formationCount.key);
      },
    }));

    const formationFilter: QuickFilterData = {
      name: "formations",
      selectedKeys: [selectedFormation],
      items: [
        {
          key: "BASE",
          label: "BASE",
          onClick: () => {
            setSelectedFormation("BASE");
          },
        },
        ...formationFIlterItems,
      ],
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
        positionByFormation && positionByFormation?.length > 0
          ? positionByFormation
          : displayPositions.map((position) => position.key);

      const groupedPositions = getGroupedPositions(positions);

      const groupedPlayers = createGroupedPlayers({
        playerStatistics,
        groupedPositions,
      });

      return {
        groupedPlayers: groupedPlayers,
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
