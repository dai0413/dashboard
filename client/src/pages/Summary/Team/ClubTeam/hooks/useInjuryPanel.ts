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

export const useInjuryPanel = () => {
  const [injuries, setInjuries] = useState<
    Data<GettedModelDataMap[ModelType.INJURY]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readInjuries = async (teamId: string, seasonRange: string[]) => {
    const obj = await readItemsBase<ModelDataMap[ModelType.INJURY][]>({
      apiInstance: api,
      backendRoute: API_PATHS.INJURY.ROOT,
      params: {
        getAll: true,
        team: teamId,
        doa: seasonRange,
      },
      handleLoading: (time) => {
        setInjuries((prev) => ({ ...prev, isLoading: time === "start" }));
      },
    });

    if (obj) {
      let processed = convert(ModelType.INJURY, obj.data);

      setInjuries({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  return {
    injuries,
    readInjuries,
  };
};
