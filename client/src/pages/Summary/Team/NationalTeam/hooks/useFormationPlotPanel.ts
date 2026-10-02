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
import { NationalMatchSeries } from "../../../../../types/models/national-match-series";
import { NationalCallup } from "../../../../../types/models/national-callup";
import { normalizeFiltersForApi } from "../../../../../utils/filter/normalizeFiltersForApi";
import { TeamMatchFormation } from "../../../../../types/models/team-match-formation";
import { quickFilterItems } from "../constants/quickFilterItems";
import { QuickFilterData } from "../../../../../types/table";

export const useFormationPlotPanel = () => {
  const [formationPlotIsLoading, setFormationPlotIsLoading] =
    useState<boolean>(false);

  const [groupedPlayers, setGroupedPlayers] = useState<GroupedPlayers[]>([]);
  const [quickFilterDatas, setQuickFilterDatas] = useState<QuickFilterData[]>([
    quickFilterItems,
  ]);

  const handleReset = () => {
    setGroupedPlayers([]);
    setQuickFilterDatas([quickFilterItems]);
  };

  const readFormationPlot = async (teamId: string) => {
    const readParams: Record<string, any> = {
      getAll: true,
      team: teamId,
    };
    const filterConditions = quickFilterItems.items.find(
      (v) => v.defaultSelect,
    )?.filterCondition;
    const joined_atObj = filterConditions?.find((f) => f.key === "joined_at");
    const left_atObj = filterConditions?.find((f) => f.key === "left_at");

    if (!joined_atObj || !left_atObj) return handleReset();

    if (filterConditions && filterConditions.length > 0) {
      readParams.filters = JSON.stringify(
        normalizeFiltersForApi(filterConditions),
      );
    }

    const obj = await readItemsBase<NationalMatchSeries[]>({
      apiInstance: api,
      backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
      params: readParams,
    });

    const seriesIds = obj?.data.map((d) => d._id);

    if (!seriesIds || seriesIds.length === 0) return handleReset();

    const matchIds = [
      ...new Set(obj?.data.flatMap((d) => d.matches.map((m) => m._id)) ?? []),
    ];
    if (matchIds.length === 0) return handleReset();

    // 対象試合のフォメ集計

    const newFormationCounts = await getFormationCounts(teamId, matchIds);

    if (!newFormationCounts) return handleReset();

    setQuickFilterDatas([quickFilterItems]);
  };

  const reloadFun = async (
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[],
    teamId: string,
  ) => {
    setFormationPlotIsLoading(true);

    try {
      // 期間内のフォメ集計

      // 日付から対象試合, 対象選手
      const readParams: Record<string, any> = {
        getAll: true,
        team: teamId,
      };
      const joined_atObj = filterConditions?.find((f) => f.key === "joined_at");
      const left_atObj = filterConditions?.find((f) => f.key === "left_at");

      if (!joined_atObj || !left_atObj) return handleReset();

      if (filterConditions && filterConditions.length > 0) {
        readParams.filters = JSON.stringify(
          normalizeFiltersForApi(
            filterConditions.filter((f) => f.key !== "formation"),
          ),
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

      if (!seriesIds || seriesIds.length === 0) return handleReset();

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

      if (matchIds.length === 0) return handleReset();

      const newFormationCounts = await getFormationCounts(teamId, matchIds);

      if (!newFormationCounts) return handleReset();

      const playerIds: string[] = [
        ...new Set((nationalCallupRes?.data ?? []).map((d) => d.player._id)),
      ];

      // 選択中のフォメ
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

        formation = newFormationCounts[0].name;
      }

      const formationRes = await readItemsBase<Formation[]>({
        apiInstance: api,
        backendRoute: API_PATHS.FORMATION.ROOT,
        params: { name: formation },
      });

      if (!formationRes?.data || formationRes.data.length !== 1)
        return handleReset();

      const selectedFormation = formationRes.data[0];

      const teamMatchFormationsRes = await readItemsBase<TeamMatchFormation[]>({
        apiInstance: api,
        backendRoute: API_PATHS.TEAM_MATCH_FORMATION.ROOT,
        params: {
          formation: selectedFormation._id,
          match: matchIds,
          team: teamId,
        },
      });

      if (
        !teamMatchFormationsRes?.data ||
        teamMatchFormationsRes.data.length <= 0
      )
        return handleReset();

      const targetMatchIds = teamMatchFormationsRes.data.map(
        (teamMatchFormation) => teamMatchFormation.match._id,
      );

      const playerStatistic = await createItemBase<PlayerStatistic[]>({
        apiInstance: api,
        backendRoute: API_PATHS.AGGREGATE.PLAYER.STATISTICS,
        data: {
          player: playerIds,
          match: targetMatchIds,
          team: teamId,
        },
      });

      if (!playerStatistic?.success) return handleReset();

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

      const formationQuickFilterItems: QuickFilterData = {
        name: "formation",
        items: newFormationCounts.map((formation, index) => {
          return {
            key: formation.name,
            label: `${formation.name} (${formation.count})`,
            defaultSelect: index === 0,
            filterCondition: [
              {
                key: "formation",
                label: "フォーメーション",
                type: "select",
                filterable: true,
                value: [formation.name],
                valueLabel: [`${formation.name} (${formation.count})`],
                operator: "equals",
              },
            ],
          };
        }),
      };

      setQuickFilterDatas([quickFilterItems, formationQuickFilterItems]);
    } finally {
      setFormationPlotIsLoading(false);
    }
  };

  return {
    formationPlotIsLoading,
    items: { groupedPlayers, quickFilterDatas },
    readFormationPlot,
    reloadFun,
  };
};
