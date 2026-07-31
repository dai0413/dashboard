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

export const useTeamMatchFormationPanel = () => {
  const [teamMatchFormations, setTeamMatchFormations] = useState<
    Data<GettedModelDataMap[ModelType.TEAM_MATCH_FORMATION]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readTeamMatchFormations = async (
    matchId?: string,
    homeTeamId?: string,
    awayTeamId?: string,
  ) => {
    if (!matchId) return;

    const team = [homeTeamId, awayTeamId].filter((v) => typeof v === "string");

    const obj = await readItemsBase<
      ModelDataMap[ModelType.TEAM_MATCH_FORMATION][]
    >({
      apiInstance: api,
      backendRoute: API_PATHS.TEAM_MATCH_FORMATION.ROOT,
      params: {
        getAll: true,
        match: matchId,
        team: team,
      },
      handleLoading: (time) => {
        setTeamMatchFormations((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (obj) {
      let processed = convert(ModelType.TEAM_MATCH_FORMATION, obj.data);

      setTeamMatchFormations({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  return {
    teamMatchFormations,
    readTeamMatchFormations,
  };
};
