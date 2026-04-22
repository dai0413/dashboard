import { NationalCallupForm } from "../../../../../types/models/national-callup";
import { OnChange } from "../../../../../types/form/onChange";

export const updateDatesFromStatus: OnChange<NationalCallupForm> = async (
  formData,
) => {
  let newFormData: Partial<NationalCallupForm> = {};
  let newFormLabel: Partial<Record<string, any>> = {};

  if (formData.status) {
    if (formData.status === "declined") {
      delete newFormData["joined_at"];
      delete newFormLabel["joined_at"];

      delete newFormData["left_at"];
      delete newFormLabel["left_at"];
    } else if (formData.status === "withdrawn") {
      delete newFormData["left_at"];
      delete newFormLabel["left_at"];
    } else if (formData.status === "joined") {
      delete newFormData["left_reason"];
      delete newFormLabel["left_reason"];
    }
  }

  return { formData: newFormData, formLabel: newFormLabel };
};
