import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { api } from "../../../../../context/api-context";
import { GettedModelDataMap, ModelType } from "../../../../../types/models";
import { Data } from "../../../../../types/types";
import { readItemsBase } from "../../../../../lib/api";
import { NationalCallup } from "../../../../../types/models/national-callup";
import { NationalMatchSeries } from "../../../../../types/models/national-match-series";

export const usePlayerPanel = () => {
  const [players, setPlayers] = useState<
    Data<GettedModelDataMap[ModelType.PLAYER]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readPlayers = async (teamId: string) => {
    const nationalCallups = await readItemsBase<NationalCallup[]>({
      apiInstance: api,
      backendRoute: API_PATHS.NATIONAL_CALLUP.ROOT,
      params: {
        getAll: true,
        "series.team": teamId,
        sort: "-joined_at",
      },
    });

    const nationalMatchSeries = await readItemsBase<NationalMatchSeries[]>({
      apiInstance: api,
      backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
      params: {
        getAll: true,
        team: teamId,
        sort: "-joined_at",
      },
    });

    if (!nationalMatchSeries?.data || nationalMatchSeries?.data.length === 0)
      return;
    if (!nationalCallups?.data || nationalCallups?.data.length === 0) return;

    const uniqueDatas = nationalCallups.data
      .filter(
        (nationalCallup, index, self) =>
          self.findIndex((u) => u.player._id === nationalCallup.player._id) ===
          index,
      )
      .sort((a, b) => {
        if (!a.player.dob && !b.player.dob) return 0;
        if (!a.player.dob) return 1; // 生年月日がないものを後ろに
        if (!b.player.dob) return -1;

        return (
          new Date(a.player.dob).getTime() - new Date(b.player.dob).getTime()
        );
      });

    const players = uniqueDatas.map((data) => data.player);

    return setPlayers({
      data: players,
      totalCount: players.length,
      page: 1,
      isLoading: false,
    });
  };

  return {
    players,
    readPlayers,
  };
};
