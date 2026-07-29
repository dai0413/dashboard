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

export const useFutureInPanel = () => {
  // //future_in
  const [futurein, setFuturein] = useState<
    Data<GettedModelDataMap[ModelType.TRANSFER]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readFutureins = async (teamId: string, from_date: string[]) => {
    const obj = await readItemsBase<ModelDataMap[ModelType.TRANSFER][]>({
      apiInstance: api,
      backendRoute: API_PATHS.TRANSFER.ROOT,
      params: {
        getAll: true,
        from_date: from_date,
        to_team: teamId,
        "from_team.age_group": "!full",
        from_team: `exists`,
        isCancelled: "!true",
        form: "完全",
      },
      handleLoading: (time) => {
        setFuturein((prev) => ({ ...prev, isLoading: time === "start" }));
      },
    });

    if (obj) {
      let processed = convert(ModelType.TRANSFER, obj.data);

      setFuturein({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  return {
    futurein,
    readFutureins,
  };
};
