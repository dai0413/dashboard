import { useCallback, useMemo, useState } from "react";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { MatchGet } from "../../../../../types/models/match";
import { TeamMatchFormationGet } from "../../../../../types/models/team-match-formation";
import { FormationGet } from "../../../../../types/models/formation";
import { FormationCounts } from "../types";
import { getFormationCounts } from "../../../../../utils/data";
import { QuickFilterData } from "../../../../../types/table";
import { loadPlayerStatistics } from "../utils/loadPlayerStatistics";
import { toggleCompetition } from "../utils/appearancePlotPanelUtils";
import { loadTeamMatches } from "../utils/loadTeamMatches";
import { displayPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/context/displayPositions";
import { getGroupedPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/MatchMatrix/utils";
import { createGroupedPlayers } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/utils";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import {
  loadFormationByName,
  loadFormationData,
} from "../utils/formationPlotPanelUtils";

type LoadFormationPlayerStatisticsParams = {
  teamId: string;
  date: string[];
  matchIds: string[];
  formationId?: string;
  competitions?: string[];
  selectedPositions?: string[];
};

export const useFormationPlotPanel = (teamId: string, date: string[]) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [matches, setMatches] = useState<MatchGet[]>([]);
  const [playerStatistics, setPlayerStatistics] = useState<PlayerStatistic[]>(
    [],
  );
  const [formationCounts, setFormationCounts] = useState<FormationCounts[]>([]);

  const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>(
    [],
  );
  const [selectedFormation, setSelectedFormation] = useState<
    FormationGet | undefined
  >(undefined);
  const [teamMatchFormations, setTeamMatchFormations] = useState<
    TeamMatchFormationGet[]
  >([]);

  const loadFormationPlayerStatistics = async ({
    teamId,
    date,
    matchIds,
    formationId,
    competitions,
    selectedPositions,
  }: LoadFormationPlayerStatisticsParams) => {
    const targetMatchIds = await loadFormationData({
      teamId,
      matchIds,
      formation: formationId,
      competitions,
    });

    await loadPlayerStatistics({
      teamId,
      date,
      matchIds: targetMatchIds,
      selectedPositions,
      setPlayerStatistics,
    });
  };

  const loadFormationCounts = async (
    teamId: string,
    matchIds: string[],
  ): Promise<FormationCounts[] | undefined> => {
    const newFormationCounts = await getFormationCounts(
      teamId,
      matchIds,
      setTeamMatchFormations,
    );

    if (!newFormationCounts) return undefined;

    setFormationCounts(newFormationCounts);

    return newFormationCounts;
  };

  const loadSelectedFormationPlayerStatistics = async ({
    teamId,
    date,
    matchIds,
    formationCount,
  }: {
    teamId: string;
    date: string[];
    matchIds: string[];
    formationCount: FormationCounts;
  }) => {
    setSelectedFormation(formationCount);

    const formation = await loadFormationByName(formationCount.name);

    if (!formation) return;

    await loadFormationPlayerStatistics({
      teamId,
      date,
      matchIds,
      formationId: formation._id,
      selectedPositions: formationCount.position_formation,
    });
  };

  // matches, playerStatistics , formationCounts , teamMatchFormations読み込み
  const reloadFun = async (
    filterConditions: FilterableFieldDefinition[],
    _sortConditions: SortableFieldDefinition[],
    teamId: string,
    date: string[],
  ) => {
    setIsLoading(true);

    try {
      const { matches, matchIds, competitionIds } = await loadTeamMatches(
        teamId,
        date,
      );

      setMatches(matches);
      setSelectedCompetitions(competitionIds);

      let formation: string | undefined;

      filterConditions?.forEach((filterCondition) => {
        if (filterCondition.key === "formation" && filterCondition.value) {
          const value = filterCondition.value[0];

          if (typeof value === "string") {
            formation = value;
          }
        }
      });

      if (!formation) {
        const newFormationCounts = await loadFormationCounts(teamId, matchIds);

        if (!newFormationCounts?.length) return;

        const firstFormation = newFormationCounts[0];

        await loadSelectedFormationPlayerStatistics({
          teamId,
          date,
          matchIds,
          formationCount: firstFormation,
        });

        return;
      }

      const selectedFormation = await loadFormationByName(formation);

      if (!selectedFormation) return;

      await loadFormationPlayerStatistics({
        teamId,
        date,
        matchIds,
        formationId: selectedFormation._id,
        selectedPositions: selectedFormation.position_formation,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // competitionIdsの変更　→　formationCounts, playerStatisticsの更新
  const handleCompetitionClick = useCallback(
    async (competitionId: string) => {
      setIsLoading(true);

      try {
        ///////// matchesからcompetitionIds使ってフィルタリング

        const newCompetitionIds = toggleCompetition(
          selectedCompetitions,
          competitionId,
        );

        const { matchIds } = await loadTeamMatches(
          teamId,
          date,
          newCompetitionIds,
        );

        if (newCompetitionIds.length === 0) {
          setFormationCounts([]);
          setSelectedFormation(undefined);
          setPlayerStatistics([]);
          setSelectedCompetitions(newCompetitionIds);

          return;
        }

        setSelectedCompetitions(newCompetitionIds);

        const newFormationCounts = await loadFormationCounts(teamId, matchIds);

        if (!newFormationCounts?.length) {
          setSelectedFormation(undefined);
          setPlayerStatistics([]);
          return;
        }

        await loadSelectedFormationPlayerStatistics({
          teamId,
          date,
          matchIds,
          formationCount: newFormationCounts[0],
        });
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCompetitions, teamId, date],
  );

  // formationの変更　→　playerStatisticsの更新
  const handleFormationClick = useCallback(
    async (formation: FormationGet) => {
      setIsLoading(true);

      try {
        const isChanged = formation._id !== selectedFormation?._id;

        const matchIds = matches
          .filter(
            (match) =>
              match.competition.id &&
              selectedCompetitions.includes(match.competition.id),
          )
          .map((match) => match._id);

        if (isChanged) {
          setSelectedFormation(formation);

          await loadFormationPlayerStatistics({
            teamId,
            date,
            matchIds,
            formationId: formation._id,
            competitions: selectedCompetitions.map((c) => c),
            selectedPositions: formationCounts.find(
              (f) => f.key === formation.key,
            )?.position_formation,
          });
        } else {
          await loadFormationPlayerStatistics({
            teamId,
            date,
            matchIds,
            competitions: selectedCompetitions.map((c) => c),
            selectedPositions: formationCounts.find(
              (f) => f.key === formation.key,
            )?.position_formation,
          });

          setSelectedFormation(undefined);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCompetitions, matches, selectedFormation, formationCounts],
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

    const formationFilter: QuickFilterData = {
      name: "formations",
      selectedKeys: selectedFormation ? [selectedFormation.key] : undefined,
      items: formationCounts.map((formationCount) => ({
        key: formationCount.key,
        label: `${formationCount.name} (${formationCount.count})`,
        onClick: () => {
          handleFormationClick(formationCount);
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

  const { groupedPlayers } = useMemo(() => {
    const positionByFormation = formationCounts.find(
      (formation) => formation.key === selectedFormation?.key,
    )?.position_formation;

    const positions =
      positionByFormation ?? displayPositions.map((position) => position.key);

    const groupedPositions = getGroupedPositions(positions);

    const groupedPlayers = createGroupedPlayers({
      playerStatistics,
      groupedPositions,
      multiPosition: true,
    });

    return {
      groupedPlayers,
    };
  }, [
    playerStatistics,
    formationCounts,
    selectedFormation,
    displayPositions,
    date,
  ]);

  const filteredTeamMatchFormations = useMemo(() => {
    if (!selectedFormation) return teamMatchFormations;

    const filtered = teamMatchFormations.filter(
      (tmf) => tmf.formation.id === selectedFormation?._id,
    );

    return filtered;
  }, [selectedFormation, teamMatchFormations]);

  return {
    isLoading,
    items: {
      teamMatchFormations: filteredTeamMatchFormations,
      groupedPlayers,
      quickFilterDatas,
    },
    reloadFun,
  };
};
