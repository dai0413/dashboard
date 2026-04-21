import { AlertStatus } from "../../../../../types/alert";
import { FormTypeMap, ModelType } from "../../../../../types/models";
import { validateEitherOne } from "../../../utils/validate/eitherOne";

export const validateRefereeEitherOne = (
  formData: Partial<FormTypeMap[ModelType.REFEREE_APPEARANCE]>,
): AlertStatus =>
  validateEitherOne(
    formData,
    "referee",
    "referee_name",
    "審判は選択、または入力してください",
  );
