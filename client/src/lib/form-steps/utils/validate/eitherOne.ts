import { AlertStatus } from "../../../../types/alert";

export const validateEitherOne = (
  formData: Record<string, any>,
  fieldA: string,
  fieldB: string,
  message: string,
): AlertStatus => {
  if (formData[fieldA] && formData[fieldB]) {
    return { success: false, message };
  }
  return { success: true };
};
