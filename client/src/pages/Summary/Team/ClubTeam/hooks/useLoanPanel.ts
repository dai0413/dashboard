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

export const useLoanPanel = () => {
  const [loans, setLoans] = useState<
    Data<GettedModelDataMap[ModelType.TRANSFER]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readLoans = async (
    teamId: string,
    seasonRange: string[],
  ): Promise<Data<GettedModelDataMap[ModelType.TRANSFER]> | null> => {
    const obj = await readItemsBase<ModelDataMap[ModelType.TRANSFER][]>({
      apiInstance: api,
      backendRoute: API_PATHS.TRANSFER.ROOT,
      params: {
        getAll: true,
        from_team: teamId,
        form: [
          "期限付き",
          "育成型期限付き",
          "期限付き延長",
          "育成型期限付き延長",
        ],
        from_date: seasonRange,
        isCancelled: "!true",
      },
      handleLoading: (time) => {
        setLoans((prev) => ({ ...prev, isLoading: time === "start" }));
      },
    });

    if (!obj) return null;

    const nextItems = {
      data: convert(ModelType.TRANSFER, obj.data),
      totalCount: obj.totalCount ?? 0,
      page: obj.page ?? 1,
      isLoading: false,
    };

    setLoans(nextItems);

    return nextItems;
  };

  return {
    loans,
    readLoans,
    setLoans,
  };
};
