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

export const useTransferOutPanel = () => {
  const [transferOuts, setTransferOuts] = useState<
    Data<GettedModelDataMap[ModelType.TRANSFER]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readTransferOuts = async (
    teamId: string,
    seasonRange: string[],
  ): Promise<Data<GettedModelDataMap[ModelType.TRANSFER]> | null> => {
    const obj = await readItemsBase<ModelDataMap[ModelType.TRANSFER][]>({
      apiInstance: api,
      backendRoute: API_PATHS.TRANSFER.ROOT,
      params: {
        getAll: true,
        from_team: teamId,
        from_date: seasonRange,
        isCancelled: "!true",
      },
      handleLoading: (time) => {
        setTransferOuts((prev) => ({ ...prev, isLoading: time === "start" }));
      },
    });

    if (!obj) return null;

    const nextItems = {
      data: convert(ModelType.TRANSFER, obj.data),
      totalCount: obj.totalCount ?? 0,
      page: obj.page ?? 1,
      isLoading: false,
    };

    setTransferOuts(nextItems);

    return nextItems;
  };

  return {
    transferOuts,
    readTransferOuts,
    setTransferOuts,
  };
};
