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

export const useStaffMatchEventLogPanel = () => {
  const [staffMatchEventLogs, setStaffMatchEventLogs] = useState<
    Data<GettedModelDataMap[ModelType.STAFF_MATCH_EVENT_LOG]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readStaffMatchEventLogs = async (
    matchId?: string,
    homeTeamId?: string,
    awayTeamId?: string,
  ) => {
    if (!matchId) return;

    const team = [homeTeamId, awayTeamId].filter((v) => typeof v === "string");

    const obj = await readItemsBase<
      ModelDataMap[ModelType.STAFF_MATCH_EVENT_LOG][]
    >({
      apiInstance: api,
      backendRoute: API_PATHS.STAFF_MATCH_EVENT_LOG.ROOT,
      params: {
        getAll: true,
        match: matchId,
        sort: "time",
        team: team,
      },
      handleLoading: (time) => {
        setStaffMatchEventLogs((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (obj) {
      let processed = convert(ModelType.STAFF_MATCH_EVENT_LOG, obj.data);

      setStaffMatchEventLogs({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  return {
    staffMatchEventLogs,
    readStaffMatchEventLogs,
  };
};
