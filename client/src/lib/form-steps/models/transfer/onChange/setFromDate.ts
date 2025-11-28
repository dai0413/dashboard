import { FormUpdatePair } from "../../../../../types/form";
import { TransferForm } from "../../../../../types/models/transfer";
import { getSeasonDates } from "../../../../../utils/getSeasonDates";

export function setFromDate(formData: Partial<TransferForm>): FormUpdatePair {
  let obj: FormUpdatePair = [];
  if (
    formData.form === "満了" ||
    formData.form === "期限付き満了" ||
    formData.form === "育成型期限付き満了" ||
    formData.form === "引退"
  ) {
    const { seasonEnd } = getSeasonDates();
    obj.push({ key: "from_date", value: seasonEnd });
  }

  return obj;
}
