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

export const useNationalCallupPanel = () => {
  const [nationalCallups, setNationalCallups] = useState<
    Data<GettedModelDataMap[ModelType.NATIONAL_CALLUP]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readNationalCallups = async (playerId: string) => {
    const obj = await readItemsBase<ModelDataMap[ModelType.NATIONAL_CALLUP][]>({
      apiInstance: api,
      backendRoute: API_PATHS.NATIONAL_CALLUP.ROOT,
      params: { getAll: true, player: playerId },
      handleLoading: (time) => {
        setNationalCallups((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (obj) {
      let processed = convert(ModelType.NATIONAL_CALLUP, obj.data);

      setNationalCallups({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  return {
    nationalCallups,
    readNationalCallups,
  };
};
