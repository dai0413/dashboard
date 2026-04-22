import { TransferForm } from "../../../../../types/models/transfer";
import { getSeasonDates } from "../../../../../utils/getSeasonDates";
import { OnChange } from "../../../../../types/form/onChange";

export const setFromDate: OnChange<TransferForm> = async (formData) => {
  let returnValue: Partial<TransferForm> = {};
  let returnFormLabel: Record<string, any> = {};

  if (
    formData.form === "満了" ||
    formData.form === "期限付き満了" ||
    formData.form === "育成型期限付き満了" ||
    formData.form === "引退"
  ) {
    const { seasonEnd } = getSeasonDates();

    returnValue["from_date"] = seasonEnd.toISOString();
    returnFormLabel["from_date"] = seasonEnd;
  }

  if (formData.form === "更新") {
    const { nextSeasonStart } = getSeasonDates();

    returnValue["from_date"] = nextSeasonStart.toISOString();
    returnFormLabel["from_date"] = nextSeasonStart;
  }

  return { formData: returnValue, formLabel: returnFormLabel };
};
