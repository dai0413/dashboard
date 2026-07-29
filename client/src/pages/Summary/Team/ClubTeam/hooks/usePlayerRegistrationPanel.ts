import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { api } from "../../../../../context/api-context";
import {
  GettedModelDataMap,
  ModelDataMap,
  ModelType,
} from "../../../../../types/models";
import { Data } from "../../../../../types/types";
import { readItemsBase } from "../../../../../lib/api";
import { convert } from "../../../../../lib/convert/DBtoGetted";

export const usePlayerRegistrationPanel = () => {
  const [playerRegistrations, setPlayerRegistrations] = useState<
    Data<GettedModelDataMap[ModelType.PLAYER_REGISTRATION]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readPlayerRegistrations = async (teamId: string, seasonId?: string) => {
    let params: Record<string, any> = {
      getAll: true,
      team: teamId,
      registration_type: "register",
      sort: "number,date",
    };

    if (seasonId) params.season = seasonId;

    const obj = await readItemsBase<
      ModelDataMap[ModelType.PLAYER_REGISTRATION][]
    >({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER_REGISTRATION.ROOT,
      params: params,
      handleLoading: (time) => {
        setPlayerRegistrations((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (obj) {
      let processed = convert(ModelType.PLAYER_REGISTRATION, obj.data);

      setPlayerRegistrations({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  return {
    playerRegistrations,
    readPlayerRegistrations,
  };
};
