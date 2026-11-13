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

export const useHomeSubMemberPanel = () => {
  const [homeSubMembers, setHomeSubMembers] = useState<
    Data<GettedModelDataMap[ModelType.PLAYER_APPEARANCE]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readHomeSubMembers = async (
    matchId?: string,
    homeTeamId?: string,
  ): Promise<Data<GettedModelDataMap[ModelType.PLAYER_APPEARANCE]> | null> => {
    if (!matchId || !homeTeamId) return null;

    const obj = await readItemsBase<
      ModelDataMap[ModelType.PLAYER_APPEARANCE][]
    >({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
      params: {
        getAll: true,
        match: matchId,
        team: homeTeamId,
      },
      handleLoading: (time) => {
        setHomeSubMembers((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (!obj) return null;

    const nextItems = {
      data: convert(ModelType.PLAYER_APPEARANCE, obj.data),
      totalCount: obj.totalCount ?? 0,
      page: obj.page ?? 1,
      isLoading: false,
    };

    setHomeSubMembers(nextItems);

    return nextItems;
  };

  return {
    homeSubMembers,
    readHomeSubMembers,
    setHomeSubMembers,
  };
};
