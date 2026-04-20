import { AlertStatus } from "../../../../../types/alert";
import { FormTypeMap, ModelType } from "../../../../../types/models";
import { validateEitherOne } from "../../../utils/validate/eitherOne";

export const validatePlayerEitherOne = (
  formData: Partial<FormTypeMap[ModelType.PLAYER_APPEARANCE]>,
): AlertStatus =>
  validateEitherOne(
    formData,
    "player",
    "player_name",
    "選手は選択、または入力してください",
  );
