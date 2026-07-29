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

export const useSeriesPanel = () => {
  const [series, setSeries] = useState<
    Data<GettedModelDataMap[ModelType.NATIONAL_MATCH_SERIES]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readSeries = async (teamId: string) => {
    const obj = await readItemsBase<
      ModelDataMap[ModelType.NATIONAL_MATCH_SERIES][]
    >({
      apiInstance: api,
      backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
      params: { getAll: true, team: teamId, sort: "-joined_at" },
      handleLoading: (time) => {
        setSeries((prev) => ({ ...prev, isLoading: time === "start" }));
      },
    });

    if (obj) {
      let processed = convert(ModelType.NATIONAL_MATCH_SERIES, obj.data);

      setSeries({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  return {
    series,
    readSeries,
  };
};
