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

export const useTransferPanel = () => {
  const [transfers, setTransfers] = useState<
    Data<GettedModelDataMap[ModelType.TRANSFER]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readTransfers = async (
    playerId: string,
  ): Promise<Data<GettedModelDataMap[ModelType.TRANSFER]> | null> => {
    const obj = await readItemsBase<ModelDataMap[ModelType.TRANSFER][]>({
      apiInstance: api,
      backendRoute: API_PATHS.TRANSFER.ROOT,
      params: { getAll: true, player: playerId, sort: "-from_date,-_id" },
      handleLoading: (time) => {
        setTransfers((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (!obj) return null;

    const nextItems = {
      data: convert(ModelType.TRANSFER, obj.data),
      totalCount: obj.totalCount ?? 0,
      page: obj.page ?? 1,
      isLoading: false,
    };

    setTransfers(nextItems);

    return nextItems;
  };

  return {
    transfers,
    readTransfers,
    setTransfers,
  };
};
