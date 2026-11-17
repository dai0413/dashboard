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

export const useCompetitionPanel = () => {
  const [competitions, setCompetitions] = useState<
    Data<GettedModelDataMap[ModelType.COMPETITION]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readCompetitions = async (
    countryId?: string,
  ): Promise<Data<GettedModelDataMap[ModelType.COMPETITION]> | null> => {
    if (!countryId) return null;
    const obj = await readItemsBase<ModelDataMap[ModelType.COMPETITION][]>({
      apiInstance: api,
      backendRoute: API_PATHS.COMPETITION.ROOT,
      params: { getAll: true, country: countryId, sort: "_id" },
      handleLoading: (time) => {
        setCompetitions((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (!obj) return null;

    const nextItems = {
      data: convert(ModelType.COMPETITION, obj.data),
      totalCount: obj.totalCount ?? 0,
      page: obj.page ?? 1,
      isLoading: false,
    };

    setCompetitions(nextItems);

    return nextItems;
  };

  return {
    competitions,
    readCompetitions,
    setCompetitions,
  };
};
