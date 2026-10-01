import { useState } from "react";
import {
  API_PATHS,
  FilterableFieldDefinition,
  QueryParams,
  SortableFieldDefinition,
  sortByPosition,
} from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { api } from "../../../../../context/api-context";
import { createItemBase, readItemsBase } from "../../../../../lib/api";
import { PlayerAppearance } from "../../../../../types/models/player-appearance";
import { Match } from "../../../../../types/models/match";
import { PlayerRegistration } from "../../../../../types/models/player-registration";
import { TeamMatchFormation } from "../../../../../types/models/team-match-formation";
import { Formation } from "../../../../../types/models/formation";
import { GroupedPlayers } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/type";
import { createGroupedPlayers } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/utils";
import { getGroupedPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/MatchMatrix/utils";
import { displayPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/context/displayPositions";
import { FormationCounts } from "../types";
import { getFormationCounts } from "../../../../../utils/data";

export const useFormationPlotPanel = () => {
  const [formationPlotIsLoading, setFormationPlotIsLoading] =
    useState<boolean>(false);

  const [groupedPlayers, setGroupedPlayers] = useState<GroupedPlayers[]>([]);
  const [formationCounts, setFormationCounts] = useState<FormationCounts[]>([]);

  const readFormationPlot = async (
    filterConditions: FilterableFieldDefinition[],
    _sortConditions: SortableFieldDefinition[],
    teamId: string,
    date: string[],
  ) => {
    setFormationPlotIsLoading(true);

    try {
      let playerIds: string[] = [];

      const match = await readItemsBase<Match[]>({
        apiInstance: api,
        backendRoute: API_PATHS.MATCH.ROOT,
        params: { getAll: true, team: teamId, date },
      });

      const matchIds = [...(new Set(match?.data.map((m) => m._id)) ?? [])];

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
        const newFormationCounts = await getFormationCounts(teamId, matchIds);
        newFormationCounts && setFormationCounts(newFormationCounts);

        return;
      }

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

      const playerAppearanceRes = await readItemsBase<PlayerAppearance[]>({
        apiInstance: api,
        backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
        params: { getAll: true, team: teamId, match: targetMatchIds },
      });

      playerIds = [
        ...new Set([
          ...playerIds,
          ...(playerAppearanceRes?.data ?? []).map((d) => d.player._id),
        ]),
      ];

      const playerRegistration = await readItemsBase<PlayerRegistration[]>({
        apiInstance: api,
        backendRoute: API_PATHS.PLAYER_REGISTRATION.ROOT,
        params: { getAll: true, team: teamId, date },
      });

      playerIds = [
        ...new Set([
          ...playerIds,
          ...(playerRegistration?.data ?? []).map((d) => d.player._id),
        ]),
      ];

      const params: QueryParams = {
        player: playerIds,
        team: teamId,
        match: targetMatchIds,
      };

      if (targetMatchIds.length > 0) {
        params["_id"] = targetMatchIds;
      }

      const playerStatistic = await createItemBase<PlayerStatistic[]>({
        apiInstance: api,
        backendRoute: API_PATHS.AGGREGATE.PLAYER.STATISTICS,
        data: params,
      });

      if (playerStatistic?.success) {
        const playerStatistics = sortByPosition(
          playerStatistic.data,
          "mainPosition",
        );

        const positionOptions = getGroupedPositions(
          selectedFormation
            ? selectedFormation.position_formation
            : displayPositions.map((d) => d.key),
        );

        const newGroupedPlayers = createGroupedPlayers(
          playerStatistics,
          positionOptions,
        );

        setGroupedPlayers(newGroupedPlayers);
      }
    } finally {
      setFormationPlotIsLoading(false);
    }
  };

  return {
    formationPlotIsLoading,
    items: { groupedPlayers, formationCounts },
    readFormationPlot,
  };
};
