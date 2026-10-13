import { useCallback, useMemo, useState } from "react";
import {
  API_PATHS,
  FilterableFieldDefinition,
  QueryParams,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { api } from "../../../../../context/api-context";
import { readItemsBase } from "../../../../../lib/api";
import { MatchGet } from "../../../../../types/models/match";
import {
  TeamMatchFormation,
  TeamMatchFormationGet,
} from "../../../../../types/models/team-match-formation";
import { Formation, FormationGet } from "../../../../../types/models/formation";
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
        const newFormationCounts = await getFormationCounts(
          teamId,
          matchIds,
          setTeamMatchFormations,
        );

        if (newFormationCounts) {
          setFormationCounts(newFormationCounts);
          formation = newFormationCounts[0].name;
          setSelectedFormation(newFormationCounts[0]);
        }
      }
      if (!formation) return;

      const formationRes = await readItemsBase<Formation[]>({
        apiInstance: api,
        backendRoute: API_PATHS.FORMATION.ROOT,
        params: { name: formation },
      });

      if (!formationRes?.data || formationRes.data.length !== 1) return;

      const selectedFormation = formationRes.data[0];
      const formationId = selectedFormation._id;

      const teamMatchFormations = await readItemsBase<TeamMatchFormation[]>({
        apiInstance: api,
        backendRoute: API_PATHS.TEAM_MATCH_FORMATION.ROOT,
        params: {
          getAll: true,
          team: teamId,
          match: matchIds,
          formation: formationId,
        },
      });

      if (!teamMatchFormations?.data || teamMatchFormations.data.length <= 0)
        return;

      const targetMatchIds = teamMatchFormations.data.map(
        (teamMatchFormation) => teamMatchFormation.match._id,
      );

      await loadPlayerStatistics({
        teamId,
        date,
        matchIds: targetMatchIds,
        selectedPositions: selectedFormation.position_formation,
        setPlayerStatistics,
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

        const { matchIds, competitionIds } = await loadTeamMatches(
          teamId,
          date,
          newCompetitionIds,
        );

        setSelectedCompetitions(competitionIds);

        if (competitionIds.length === 0) {
          setFormationCounts([]);
          setSelectedFormation(undefined);
          setPlayerStatistics([]);

          return;
        }

        //// formationのフィルタリング
        const newFormationCounts = await getFormationCounts(
          teamId,
          matchIds,
          setTeamMatchFormations,
        );

        if (!newFormationCounts) return;

        setFormationCounts(newFormationCounts);
        setSelectedFormation(newFormationCounts[0]);

        const formationRes = await readItemsBase<Formation[]>({
          apiInstance: api,
          backendRoute: API_PATHS.FORMATION.ROOT,
          params: { name: formationCounts[0].name },
        });

        if (!formationRes?.data || formationRes.data.length !== 1) return;

        const selectedFormation = formationRes.data[0];
        const formationId = selectedFormation._id;

        const teamMatchFormations = await readItemsBase<TeamMatchFormation[]>({
          apiInstance: api,
          backendRoute: API_PATHS.TEAM_MATCH_FORMATION.ROOT,
          params: {
            getAll: true,
            team: teamId,
            match: matchIds,
            formation: formationId,
          },
        });

        if (!teamMatchFormations?.data || teamMatchFormations.data.length <= 0)
          return;

        const targetMatchIds = teamMatchFormations.data.map(
          (teamMatchFormation) => teamMatchFormation.match._id,
        );

        await loadPlayerStatistics({
          teamId,
          date,
          matchIds: targetMatchIds,
          selectedPositions: newFormationCounts[0].position_formation,
          setPlayerStatistics,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCompetitions, matches],
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

        const params: QueryParams = {
          getAll: true,
          team: teamId,
          match: matchIds,
          competition: selectedCompetitions.map((c) => c),
        };

        if (isChanged) params["formation"] = formation._id;

        const teamMatchFormations = await readItemsBase<TeamMatchFormation[]>({
          apiInstance: api,
          backendRoute: API_PATHS.TEAM_MATCH_FORMATION.ROOT,
          params,
        });

        if (!teamMatchFormations?.data || teamMatchFormations.data.length <= 0)
          return;

        const targetMatchIds = teamMatchFormations.data.map(
          (teamMatchFormation) => teamMatchFormation.match._id,
        );

        console.log("targetMatchIds", targetMatchIds);

        await loadPlayerStatistics({
          teamId,
          date,
          matchIds: targetMatchIds,
          selectedPositions: formationCounts.find(
            (f) => f.key === formation.key,
          )?.position_formation,
          setPlayerStatistics,
        });

        if (isChanged) {
          console.log("last isChanged", isChanged);
          setSelectedFormation(formation);
        } else {
          setSelectedFormation(undefined);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCompetitions, matches, selectedFormation],
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
