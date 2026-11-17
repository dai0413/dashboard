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

export const useMatchPanel = () => {
  const [matches, setMatches] = useState<
    Data<GettedModelDataMap[ModelType.MATCH]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readMatches = async (
    matchIds: string[],
  ): Promise<Data<GettedModelDataMap[ModelType.MATCH]> | null> => {
    if (matchIds.length === 0) return null;

    const obj = await readItemsBase<ModelDataMap[ModelType.MATCH][]>({
      apiInstance: api,
      backendRoute: API_PATHS.MATCH.ROOT,
      params: {
        getAll: true,
        _id: matchIds,
        sort: "date",
      },
      handleLoading: (time) => {
        setMatches((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (!obj) return null;

    const nextItems = {
      data: convert(ModelType.MATCH, obj.data),
      totalCount: obj.totalCount ?? 0,
      page: obj.page ?? 1,
      isLoading: false,
    };

    setMatches(nextItems);

    return nextItems;
  };

  return {
    matches,
    readMatches,
    setMatches,
  };
};
