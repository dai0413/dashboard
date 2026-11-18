import { useCallback, useMemo, useState } from "react";
import {
  API_PATHS,
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player";
import { PlayerAppearanceGet } from "../../../../../types/models/player-appearance";
import { MatchGet } from "../../../../../types/models/match";
import { PlayerRegistrationGet } from "../../../../../types/models/player-registration";
import { AppearancePlotData, FormationCounts } from "../types";
import { getGroupedPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/MatchMatrix/utils";
import { createGroupedPlayers } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/utils";
import { displayPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/context/displayPositions";
import { QuickFilterData } from "../../../../../types/table";
import {
  createTopHeaderText,
  filterMatchesByCompetitions,
  toggleCompetition,
} from "../utils/appearancePlotPanelUtils";
import { loadPlayerStatistics } from "../utils/loadPlayerStatistics";
import { loadTeamMatches } from "../utils/loadTeamMatches";
import { Injury, InjuryGet } from "../../../../../types/models/injury";
import { readItemsBase } from "../../../../../lib/api";
import { api } from "../../../../../context/api-context";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { ModelType } from "../../../../../types/models";

const readInjuries = async (teamId: string, date: string[]) => {
  const startDate = date[0].replace(
    /^>=([\d]{4})/,
    (_, year) => `>=${Number(year) - 1}`,
  );

  const res = await readItemsBase<Injury[]>({
    apiInstance: api,
    backendRoute: API_PATHS.INJURY.ROOT,
    params: { doa: [startDate, date[1]], getAll: true, team: teamId },
  });
  if (!res?.data) return [];

  return convert(ModelType.INJURY, res?.data);
};

export const useAppearancePlotPanel = (teamId: string, date: string[]) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [playerAppearance, setPlayerAppearance] = useState<
    PlayerAppearanceGet[]
  >([]);
  const [playerRegistrations, setPlayerRegistrations] = useState<
    PlayerRegistrationGet[]
  >([]);
  const [injuries, setInjuries] = useState<InjuryGet[]>([]);
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
    ): Promise<AppearancePlotData | null> => {
      setIsLoading(true);

      try {
        const [{ matches, competitionIds, matchIds }, injuries] =
          await Promise.all([
            loadTeamMatches(teamId, date),
            readInjuries(teamId, date),
          ]);

        setMatches(matches);
        setInjuries(injuries);
        setSelectedCompetitions(competitionIds);

        const {
          formationCounts,
          playerStatistics,
          playerAppearance,
          playerRegistration,
        } = await loadPlayerStatistics({
          teamId,
          date,
          matchIds,
          setFormationCounts,
          setPlayerStatistics,
          setPlayerAppearance,
          setPlayerRegistrations,
        });

        const appearancePlotData: AppearancePlotData = {
          isLoading: false,

          matches,
          injuries,
          selectedCompetitions: competitionIds,
          selectedFormation: "BASE",
          formationCounts: formationCounts || [],
          playerStatistics: playerStatistics || [],
          playerAppearance: playerAppearance || [],
          playerRegistration: playerRegistration || [],
        };

        return appearancePlotData;
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

  const filteredMatches = useMemo(
    () => filterMatchesByCompetitions(matches, selectedCompetitions),
    [matches, selectedCompetitions],
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

    const formationFIlterItems =
      formationCounts.length > 0
        ? formationCounts.map((formationCount) => ({
            key: formationCount.key,
            label: `${formationCount.name} (${formationCount.count})`,
            onClick: () => {
              setSelectedFormation(formationCount.key);
            },
          }))
        : [];

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
    matches,
    selectedCompetitions,
    selectedFormation,
    formationCounts,
    handleCompetitionClick,
  ]);

  const { groupedPlayers, defaultOpenPositions, topHeaderText } =
    useMemo(() => {
      const positionByFormation =
        formationCounts.length > 0
          ? formationCounts.find(
              (formation) => formation.key === selectedFormation,
            )?.position_formation
          : undefined;

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

  const restore = ({
    isLoading,

    matches,
    selectedCompetitions,
    selectedFormation,
    formationCounts,
    playerStatistics,
    injuries,
    playerAppearance,
    playerRegistration,
  }: AppearancePlotData) => {
    setIsLoading(isLoading);
    setMatches(matches);
    setSelectedCompetitions(selectedCompetitions);
    setSelectedFormation(selectedFormation);
    setFormationCounts(formationCounts);
    setPlayerStatistics(playerStatistics);
    setInjuries(injuries);
    setPlayerAppearance(playerAppearance);
    setPlayerRegistrations(playerRegistration);
  };

  return {
    reloadFun,
    restore,
    items: {
      topHeaderText,
      playerRegistrations,
      matches: filteredMatches,
      playerAppearance,
      injuries,
      defaultOpenPositions,
      groupedPlayers,
      quickFilterDatas,

      playerStatistics,
    },
    isLoading,
  };
};
