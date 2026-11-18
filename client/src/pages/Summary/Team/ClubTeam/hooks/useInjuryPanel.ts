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

  const readInjuries = async (
    teamId: string,
    seasonRange: string[],
  ): Promise<Data<GettedModelDataMap[ModelType.INJURY]> | null> => {
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

    if (!obj) return null;

    const nextItems = {
      data: convert(ModelType.INJURY, obj.data),
      totalCount: obj.totalCount ?? 0,
      page: obj.page ?? 1,
      isLoading: false,
    };

    setInjuries(nextItems);

    return nextItems;
  };

  return {
    injuries,
    readInjuries,
    setInjuries,
  };
};
