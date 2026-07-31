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

export const useRefereeAppearancePanel = () => {
  const [refereeAppearances, setRefereeAppearances] = useState<
    Data<GettedModelDataMap[ModelType.REFEREE_APPEARANCE]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readRefereeAppearances = async (matchId?: string) => {
    if (!matchId) return;
    const obj = await readItemsBase<
      ModelDataMap[ModelType.REFEREE_APPEARANCE][]
    >({
      apiInstance: api,
      backendRoute: API_PATHS.REFEREE_APPEARANCE.ROOT,
      params: {
        getAll: true,
        match: matchId,
      },
      handleLoading: (time) => {
        setRefereeAppearances((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (obj) {
      let processed = convert(ModelType.REFEREE_APPEARANCE, obj.data);

      setRefereeAppearances({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  return {
    refereeAppearances,
    readRefereeAppearances,
  };
};
