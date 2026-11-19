import { useMemo, useState } from "react";
import {
  API_PATHS,
  FilterableFieldDefinition,
  SortableFieldDefinition,
  sortByPosition,
} from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player";
import { api } from "../../../../../context/api-context";
import { createItemBase, readItemsBase } from "../../../../../lib/api";
import { Formation } from "../../../../../types/models/formation";
import { createGroupedPlayers } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/utils";
import { getGroupedPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/MatchMatrix/utils";
import { displayPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/context/displayPositions";
import { getFormationCounts } from "../../../../../utils/data";
import { NationalMatchSeries } from "../../../../../types/models/national-match-series";
import { NationalCallup } from "../../../../../types/models/national-callup";
import { normalizeFiltersForApi } from "../../../../../utils/filter/normalizeFiltersForApi";
import { TeamMatchFormation } from "../../../../../types/models/team-match-formation";
import { quickFilterItems as dateQuickFilterItems } from "../constants/quickFilterItems";
import { QuickFilterData } from "../../../../../types/table";
import { FormationPlot } from "../types";
import { fullNationalPeriods } from "../../../../../constants/period";
import { FormationCounts } from "../../ClubTeam/types";

const defaultDate = fullNationalPeriods.sort(
  (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
)[0];
const defaultFilterCondition: FilterableFieldDefinition[] =
  dateQuickFilterItems.items.find((period) => period.key === defaultDate.key)
    ?.filterCondition || [];

export const useFormationPlotPanel = () => {
  const [formationPlotIsLoading, setFormationPlotIsLoading] =
    useState<boolean>(false);

  const [formationCounts, setFormationCounts] = useState<FormationCounts[]>([]);
  const [playerStatistics, setPlayerStatistics] = useState<PlayerStatistic[]>(
    [],
  );
  const [selectedFormation, setSelectedFormation] = useState<string>("");
  const [selectedDateKey, setSelectedDateKey] = useState<string>(
    defaultDate.key,
  );

  const handleReset = () => {
    setFormationPlotIsLoading(false);

    setFormationCounts([]);
    setPlayerStatistics([]);
    setSelectedFormation("");
    setSelectedDateKey(defaultDate.key);
  };

  const readFormationPlot = async (
    teamId: string,
    filterConditions?: FilterableFieldDefinition[],
    sortConditions?: SortableFieldDefinition[],
  ): Promise<FormationPlot | null> => {
    setFormationPlotIsLoading(true);
    const filters =
      filterConditions && filterConditions.length > 0
        ? filterConditions
        : defaultFilterCondition;

    const readParams: Record<string, any> = {
      getAll: true,
      team: teamId,
      filters: JSON.stringify(normalizeFiltersForApi(filters)),
    };

    if (sortConditions && sortConditions.length > 0) {
      readParams.sorts = JSON.stringify(sortConditions);
    }

    const obj = await readItemsBase<NationalMatchSeries[]>({
      apiInstance: api,
      backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
      params: readParams,
    });

    const seriesIds = obj?.data.map((d) => d._id);

    if (!seriesIds || seriesIds.length === 0) {
      handleReset();
      return null;
    }

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

    if (matchIds.length === 0) {
      handleReset();
      return null;
    }

    const values = await getFormationCounts(teamId, matchIds);

    if (!values) {
      handleReset();
      return null;
    }

    const newFormationCounts = values.formationCounts;
    const newSelectedFormation = newFormationCounts[0].key;
    setFormationCounts(newFormationCounts);
    setSelectedFormation(newSelectedFormation);

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
      const value = await getFormationCounts(teamId, matchIds);

      if (!value) {
        handleReset();
        return null;
      }

      formation = value.formationCounts[0].name;
    }

    const formationRes = await readItemsBase<Formation[]>({
      apiInstance: api,
      backendRoute: API_PATHS.FORMATION.ROOT,
      params: { name: formation },
    });

    if (!formationRes?.data || formationRes.data.length !== 1) {
      handleReset();
      return null;
    }

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
    ) {
      handleReset();
      return null;
    }

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

    if (!playerStatistic?.success) {
      handleReset();
      return null;
    }

    const newPlayerStatistics = sortByPosition(
      playerStatistic.data,
      "mainPosition",
    );

    setPlayerStatistics(newPlayerStatistics);
    setSelectedFormation(newSelectedFormation);

    setFormationPlotIsLoading(false);
    return {
      isLoading: false,
      formationCounts: newFormationCounts,
      selectedFormation: newSelectedFormation,
      playerStatistics: newPlayerStatistics,
      selectedDateKey: selectedDateKey ?? defaultDate.key,
    };
  };

  const restore = ({
    isLoading,
    formationCounts,
    selectedFormation,
    playerStatistics,
    selectedDateKey,
  }: FormationPlot) => {
    setFormationPlotIsLoading(isLoading);

    setFormationCounts(formationCounts);
    setSelectedFormation(selectedFormation);
    setPlayerStatistics(playerStatistics);
    setSelectedDateKey(selectedDateKey);
  };

  const quickFilterDatas: QuickFilterData[] = useMemo(() => {
    const formationFIlterItems = formationCounts.map((formationCount) => {
      return {
        key: formationCount.key,
        label: `${formationCount.name}  (${formationCount.count})`,
        onClick: () => {
          setSelectedFormation(formationCount.key);
        },
      };
    });

    const formationFilter: QuickFilterData = {
      name: "formations",
      selectedKeys: [selectedFormation],
      items: [...formationFIlterItems],
    };

    const converted: QuickFilterData = {
      ...dateQuickFilterItems,
      selectedKeys: [selectedDateKey],
      items: dateQuickFilterItems.items.map((item) => {
        return {
          ...item,
          onClick: () => {
            setSelectedDateKey(item.key);
          },
        };
      }),
    };

    return [converted, formationFilter];
  }, [selectedDateKey, formationCounts, selectedFormation]);

  const groupedPlayers = useMemo(() => {
    const positions =
      formationCounts.find(
        (formationCount) => formationCount.key === selectedFormation,
      )?.position_formation || displayPositions.map((d) => d.key);

    const groupedPositions = getGroupedPositions(positions);

    const newGroupedPlayers = createGroupedPlayers({
      playerStatistics: playerStatistics,
      groupedPositions,
    });

    return newGroupedPlayers;
  }, [playerStatistics, selectedFormation]);

  return {
    formationPlotIsLoading,
    items: { groupedPlayers, quickFilterDatas },
    readFormationPlot,
    restore,
  };
};
