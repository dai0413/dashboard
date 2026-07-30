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

  const readMatches = async (seasonId?: string) => {
    if (!seasonId) return;
    const obj = await readItemsBase<ModelDataMap[ModelType.MATCH][]>({
      apiInstance: api,
      backendRoute: API_PATHS.MATCH.ROOT,
      params: { getAll: true, season: seasonId },
      handleLoading: (time) => {
        setMatches((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (obj) {
      let processed = convert(ModelType.MATCH, obj.data);

      setMatches({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  return {
    matches,
    readMatches,
  };
};
