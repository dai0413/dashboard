import { useState } from "react";
import {
  API_PATHS,
  FilterableFieldDefinition,
  SortableFieldDefinition,
  sortByPosition,
} from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { api } from "../../../../../context/api-context";
import { createItemBase, readItemsBase } from "../../../../../lib/api";
import { Formation } from "../../../../../types/models/formation";
import { GroupedPlayers } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/type";
import { createGroupedPlayers } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/utils";
import { getGroupedPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/MatchMatrix/utils";
import { displayPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/context/displayPositions";
import { getFormationCounts } from "../../../../../utils/data";
import { FormationCounts } from "../../ClubTeam/types";
import { NationalMatchSeries } from "../../../../../types/models/national-match-series";
import { NationalCallup } from "../../../../../types/models/national-callup";
import { normalizeFiltersForApi } from "../../../../../utils/filter/normalizeFiltersForApi";

export const useFormationPlotPanel = () => {
  const [formationPlotIsLoading, setFormationPlotIsLoading] =
    useState<boolean>(false);

  const [groupedPlayers, setGroupedPlayers] = useState<GroupedPlayers[]>([]);
  const [formationCounts, setFormationCounts] = useState<FormationCounts[]>([]);

  const readFormationPlot = async (
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[],
    teamId: string,
  ) => {
    setFormationPlotIsLoading(true);

    try {
      const readParams: Record<string, any> = {
        getAll: true,
        team: teamId,
      };

      const joined_atObj = filterConditions?.find((f) => f.key === "joined_at");
      const left_atObj = filterConditions?.find((f) => f.key === "left_at");

      if (!joined_atObj || !left_atObj) return;

      if (filterConditions && filterConditions.length > 0) {
        readParams.filters = JSON.stringify(
          normalizeFiltersForApi(filterConditions),
        );
      }

      if (sortConditions && sortConditions.length > 0) {
        readParams.sorts = JSON.stringify(sortConditions);
      }

      const obj = await readItemsBase<NationalMatchSeries[]>({
        apiInstance: api,
        backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
        params: readParams,
      });

      const seriesIds = obj?.data.map((d) => d._id);

      if (!seriesIds || seriesIds.length === 0) return;

      const nationalCallupRes = await readItemsBase<NationalCallup[]>({
        apiInstance: api,
        backendRoute: API_PATHS.NATIONAL_CALLUP.ROOT,
        params: {
          getAll: true,
          series: seriesIds,
        },
      });

      const matchIds = [
        ...new Set(obj?.data.flatMap((d) => d.matches.map((m) => m._id)) ?? []),
      ];
      if (!matchIds) return;

      const playerIds: string[] = [
        ...new Set((nationalCallupRes?.data ?? []).map((d) => d.player._id)),
      ];

      const playerStatistic = await createItemBase<PlayerStatistic[]>({
        apiInstance: api,
        backendRoute: API_PATHS.AGGREGATE.PLAYER.STATISTICS,
        data: {
          player: playerIds,
          match: matchIds,
          team: teamId,
        },
      });

      const formationCounts = await getFormationCounts(teamId, matchIds);
      formationCounts && setFormationCounts(formationCounts);

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

        if (!newFormationCounts) return;

        setFormationCounts(newFormationCounts);

        formation = newFormationCounts[0].name;
      }

      const formationRes = await readItemsBase<Formation[]>({
        apiInstance: api,
        backendRoute: API_PATHS.FORMATION.ROOT,
        params: { name: formation },
      });

      if (!formationRes?.data || formationRes.data.length !== 1) return;

      const selectedFormation = formationRes.data[0];

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
