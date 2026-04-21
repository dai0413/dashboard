import { AxiosInstance } from "axios";
import { FormUpdatePair } from "../../../../types/form";
import { readItemBase } from "../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import { FormTypeMap, ModelType } from "../../../../types/models";
import { calcPeriodLabel } from "./calcPeriodLabel";

export const updatePeriodLabelFromMatch = async (
  data: Partial<FormTypeMap[ModelType.PLAYER_MATCH_EVENT_LOG]>,
  api?: AxiosInstance,
): Promise<FormUpdatePair> => {
  if (data.time == null || data.match == null || !api) return [];
  const time = data.time;
  if (time == null) return [];

  const resData = await readItemBase({
    apiInstance: api,
    backendRoute: API_PATHS.MATCH.DETAIL(data.match),
    returnResponse: true,
  });

  if (!resData?.data?.match_format) return [];

  const periods = resData.data.match_format.period;
  const period_label = calcPeriodLabel(data, periods);

  return period_label ? [{ key: "period_label", value: period_label }] : [];
};
