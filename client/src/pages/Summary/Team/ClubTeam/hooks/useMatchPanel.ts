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

export const useMatchPanel = () => {
  const [matches, setMatches] = useState<
    Data<GettedModelDataMap[ModelType.MATCH]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readMatches = async (teamId: string, seasonRange: string[]) => {
    const obj = await readItemsBase<ModelDataMap[ModelType.MATCH][]>({
      apiInstance: api,
      backendRoute: API_PATHS.MATCH.ROOT,
      params: {
        getAll: true,
        team: teamId,
        date: seasonRange,
        sort: "date",
      },
      handleLoading: (time) => {
        setMatches((prev) => ({ ...prev, isLoading: time === "start" }));
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
