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

export const useTeamPanel = () => {
  const [teams, setTeams] = useState<Data<GettedModelDataMap[ModelType.TEAM]>>({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readTeams = async (
    countryId?: string,
  ): Promise<Data<GettedModelDataMap[ModelType.TEAM]> | null> => {
    if (!countryId) return null;
    const obj = await readItemsBase<ModelDataMap[ModelType.TEAM][]>({
      apiInstance: api,
      backendRoute: API_PATHS.TEAM.ROOT,
      params: {
        getAll: true,
        genre: "national",
        country: countryId,
        sort: "age_group",
      },
      handleLoading: (time) => {
        setTeams((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (!obj) return null;

    const nextItems = {
      data: convert(ModelType.TEAM, obj.data),
      totalCount: obj.totalCount ?? 0,
      page: obj.page ?? 1,
      isLoading: false,
    };

    setTeams(nextItems);

    return nextItems;
  };

  return {
    teams,
    readTeams,
    setTeams,
  };
};
