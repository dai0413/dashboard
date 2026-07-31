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

export const useAwaySubMemberPanel = () => {
  const [awaySubMembers, setAwaySubMembers] = useState<
    Data<GettedModelDataMap[ModelType.PLAYER_APPEARANCE]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readAwaySubMembers = async (matchId?: string, awayTeamId?: string) => {
    if (!matchId || !awayTeamId) return;

    const obj = await readItemsBase<
      ModelDataMap[ModelType.PLAYER_APPEARANCE][]
    >({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
      params: {
        getAll: true,
        match: matchId,
        team: awayTeamId,
      },
      handleLoading: (time) => {
        setAwaySubMembers((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (obj) {
      let processed = convert(ModelType.PLAYER_APPEARANCE, obj.data);

      setAwaySubMembers({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  return {
    awaySubMembers,
    readAwaySubMembers,
  };
};
