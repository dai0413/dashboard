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

export const useInjuryPanel = () => {
  const [injuries, setInjuries] = useState<
    Data<GettedModelDataMap[ModelType.INJURY]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readinjuries = async (playerId: string) => {
    const obj = await readItemsBase<ModelDataMap[ModelType.INJURY][]>({
      apiInstance: api,
      backendRoute: API_PATHS.INJURY.ROOT,
      params: { getAll: true, player: playerId },
      handleLoading: (time) => {
        setInjuries((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
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
    readinjuries,
  };
};
