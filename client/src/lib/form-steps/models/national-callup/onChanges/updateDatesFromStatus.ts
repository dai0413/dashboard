import { NationalCallupForm } from "../../../../../types/models/national-callup";
import { FormUpdatePair } from "../../../../../types/form";

export async function updateDatesFromStatus(
  formData: Partial<NationalCallupForm>,
): Promise<FormUpdatePair> {
  let obj: FormUpdatePair = [];

  if (formData.status) {
    if (formData.status === "declined") {
      obj.push({ key: "joined_at", value: undefined });
      obj.push({ key: "left_at", value: undefined });
    } else if (formData.status === "withdrawn") {
      obj.push({ key: "left_at", value: undefined });
    } else if (formData.status === "joined") {
      obj.push({ key: "left_reason", value: undefined });
    }
  }

  return obj;
}
