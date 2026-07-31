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

export const useStaffAppearancePanel = () => {
  const [staffAppearances, setStaffAppearances] = useState<
    Data<GettedModelDataMap[ModelType.STAFF_APPEARANCE]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readStaffAppearances = async (
    matchId?: string,
    homeTeamId?: string,
    awayTeamId?: string,
  ) => {
    if (!matchId) return;

    const team = [homeTeamId, awayTeamId].filter((v) => typeof v === "string");

    const obj = await readItemsBase<ModelDataMap[ModelType.STAFF_APPEARANCE][]>(
      {
        apiInstance: api,
        backendRoute: API_PATHS.STAFF_APPEARANCE.ROOT,
        params: {
          getAll: true,
          match: matchId,
          team: team,
        },
        handleLoading: (time) => {
          setStaffAppearances((prev) => ({
            ...prev,
            isLoading: time === "start",
          }));
        },
      },
    );

    if (obj) {
      let processed = convert(ModelType.STAFF_APPEARANCE, obj.data);

      setStaffAppearances({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  return {
    staffAppearances,
    readStaffAppearances,
  };
};
