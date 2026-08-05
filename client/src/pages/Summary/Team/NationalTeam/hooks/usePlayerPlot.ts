import { useState } from "react";
import {
  API_PATHS,
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { api } from "../../../../../context/api-context";
import { ModelType } from "../../../../../types/models";
import { readItemsBase } from "../../../../../lib/api";
import { NationalCallup } from "../../../../../types/models/national-callup";
import { NationalMatchSeries } from "../../../../../types/models/national-match-series";
import {
  PlayerAppearance,
  PlayerAppearanceGet,
} from "../../../../../types/models/player-appearance";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { normalizeFiltersForApi } from "../../../../../utils/filter/normalizeFiltersForApi";

export const usePlayerPlotPanel = () => {
  const [nationalCallUp, setNationalCallUp] = useState<NationalCallup[]>([]);
  const [nationalMatchSeries, setNationalMatchSeries] = useState<
    NationalMatchSeries[]
  >([]);
  const [playerAppearance, setPlayerAppearance] = useState<
    PlayerAppearanceGet[]
  >([]);
  const [playerPlotIsLoading, setPlayerPlotIsLoading] =
    useState<boolean>(false);
  const [playerStatistics, setPlayerStatistics] = useState<PlayerStatistic[]>(
    [],
  );

  const readPlayerPlot = async (
    teamId: string,
    filterConditions?: FilterableFieldDefinition[],
    sortConditions?: SortableFieldDefinition[],
  ) => {
    setPlayerPlotIsLoading(true);
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

    if (obj?.data) setNationalMatchSeries(obj.data);

    const seriesIds = obj?.data.map((d) => d._id);

    if (!seriesIds) return setPlayerPlotIsLoading(false);

    const nationalCallupRes = await readItemsBase<NationalCallup[]>({
      apiInstance: api,
      backendRoute: API_PATHS.NATIONAL_CALLUP.ROOT,
      params: { getAll: true, series: seriesIds },
    });

    if (nationalCallupRes?.data) setNationalCallUp(nationalCallupRes.data);

    const playerIds: string[] = [
      ...new Set((nationalCallupRes?.data ?? []).map((d) => d.player._id)),
    ];

    const playerStatistic = await readItemsBase<PlayerStatistic[]>({
      apiInstance: api,
      backendRoute: API_PATHS.AGGREGATE.PLAYER.STATISTICS,
      params: { player: playerIds },
    });

    if (playerStatistic?.data) {
      setPlayerStatistics(playerStatistic.data);
    }

    const matchIds = [
      ...new Set(obj?.data.flatMap((d) => d.matches.map((m) => m._id)) ?? []),
    ];

    if (!matchIds) return setPlayerPlotIsLoading(false);

    const playerAppearanceRes = await readItemsBase<PlayerAppearance[]>({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
      params: { getAll: true, match: matchIds, team: teamId },
    });

    if (playerAppearanceRes?.data) {
      const newPlayerAppearance = convert(
        ModelType.PLAYER_APPEARANCE,
        playerAppearanceRes.data,
      );
      setPlayerAppearance(newPlayerAppearance);
    }

    setPlayerPlotIsLoading(false);
  };

  return {
    nationalCallUp,
    nationalMatchSeries,
    playerAppearance,
    playerStatistics,
    playerPlotIsLoading,
    readPlayerPlot,
  };
};
