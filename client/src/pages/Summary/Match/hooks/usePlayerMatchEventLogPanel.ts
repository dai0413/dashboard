import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import {
  GettedModelDataMap,
  ModelDataMap,
  ModelType,
} from "../../../../types/models";
import { Data } from "../../../../types/types";
import { readItemsBase } from "../../../../lib/api";
import { convert } from "../../../../lib/convert/DBtoGetted";
import { api } from "../../../../context/api-context";

export const usePlayerMatchEventLogPanel = () => {
  const [playerMatchEventLogs, setPlayerMatchEventLogs] = useState<
    Data<GettedModelDataMap[ModelType.PLAYER_MATCH_EVENT_LOG]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readPlayerMatchEventLogs = async (
    matchId?: string,
    homeTeamId?: string,
    awayTeamId?: string,
  ) => {
    if (!matchId) return;

    const team = [homeTeamId, awayTeamId].filter((v) => typeof v === "string");

    const obj = await readItemsBase<
      ModelDataMap[ModelType.PLAYER_MATCH_EVENT_LOG][]
    >({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER_MATCH_EVENT_LOG.ROOT,
      params: {
        getAll: true,
        match: matchId,
        sort: "time",
        team: team,
      },
      handleLoading: (time) => {
        setPlayerMatchEventLogs((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (obj) {
      let processed = convert(ModelType.PLAYER_MATCH_EVENT_LOG, obj.data);

      setPlayerMatchEventLogs({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  return {
    playerMatchEventLogs,
    readPlayerMatchEventLogs,
  };
};
