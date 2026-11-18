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

export const useStaffRegistrationPanel = () => {
  const [staffRegistrations, setStaffRegistrations] = useState<
    Data<GettedModelDataMap[ModelType.STAFF_REGISTRATION]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readStaffRegistrations = async (
    teamId: string,
    seasonId?: string,
  ): Promise<Data<GettedModelDataMap[ModelType.STAFF_REGISTRATION]> | null> => {
    let params: Record<string, any> = {
      getAll: true,
      team: teamId,
      registration_type: "register",
      sort: "date",
    };

    if (seasonId) params.season = seasonId;

    const obj = await readItemsBase<
      ModelDataMap[ModelType.STAFF_REGISTRATION][]
    >({
      apiInstance: api,
      backendRoute: API_PATHS.STAFF_REGISTRATION.ROOT,
      params: params,
      handleLoading: (time) => {
        setStaffRegistrations((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (!obj) return null;

    const nextItems = {
      data: convert(ModelType.STAFF_REGISTRATION, obj.data),
      totalCount: obj.totalCount ?? 0,
      page: obj.page ?? 1,
      isLoading: false,
    };

    setStaffRegistrations(nextItems);

    return nextItems;
  };

  return {
    staffRegistrations,
    readStaffRegistrations,
    setStaffRegistrations,
  };
};
