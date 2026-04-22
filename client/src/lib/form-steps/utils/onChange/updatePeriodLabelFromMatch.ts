import { readItemBase } from "../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import { calcPeriodLabel } from "./calcPeriodLabel";
import { OnChange } from "../../../../types/form/onChange";
import { PlayerMatchEventLogForm } from "../../../../types/models/player-match-event-log";

export const updatePeriodLabelFromMatch: OnChange<
  PlayerMatchEventLogForm
> = async (formData, formLabel, api?) => {
  if (formData.time == null || formData.match == null || !api)
    return { formData, formLabel };
  const time = formData.time;
  if (time == null) return { formData, formLabel };

  const resData = await readItemBase({
    apiInstance: api,
    backendRoute: API_PATHS.MATCH.DETAIL(formData.match),
    returnResponse: true,
  });

  if (!resData?.data?.match_format) return { formData, formLabel };

  const periods = resData.data.match_format.period;
  const period_label = calcPeriodLabel(formData, periods);

  let returnValue: Partial<PlayerMatchEventLogForm> = {};
  let returnFormLabel: Record<string, any> = {};

  if (period_label) {
    returnValue["period_label"] = period_label;
    returnFormLabel["period_label"] = period_label;
  }

  return { formData: returnValue, formLabel: returnFormLabel };
};
