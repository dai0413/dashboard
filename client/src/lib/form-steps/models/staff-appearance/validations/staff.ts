import { AlertStatus } from "../../../../../types/alert";
import { FormTypeMap, ModelType } from "../../../../../types/models";
import { validateEitherOne } from "../../../utils/validate/eitherOne";

export const validateStaffEitherOne = (
  formData: Partial<FormTypeMap[ModelType.STAFF_APPEARANCE]>,
): AlertStatus =>
  validateEitherOne(
    formData,
    "staff",
    "staff_name",
    "スタッフは選択、または入力してください",
  );
