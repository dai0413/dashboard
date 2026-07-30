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

export const useStaffRegistrationPanel = () => {
  const [staffRegistrations, setStaffRegistrations] = useState<
    Data<GettedModelDataMap[ModelType.STAFF_REGISTRATION]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readStaffRegistrations = async (seasonId?: string) => {
    if (!seasonId) return;
    const obj = await readItemsBase<
      ModelDataMap[ModelType.STAFF_REGISTRATION][]
    >({
      apiInstance: api,
      backendRoute: API_PATHS.STAFF_REGISTRATION.ROOT,
      params: {
        getAll: true,
        season: seasonId,
        registration_type: "register",
        sort: "team",
      },
      handleLoading: (time) => {
        setStaffRegistrations((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (obj) {
      let processed = convert(ModelType.STAFF_REGISTRATION, obj.data);

      setStaffRegistrations({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  return {
    staffRegistrations,
    readStaffRegistrations,
  };
};
