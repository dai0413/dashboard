import { AlertStatus } from "../../../../../types/alert";
import { FormTypeMap, ModelType } from "../../../../../types/models";

export const validateStadiumEitherOne = (
  formData: Partial<FormTypeMap[ModelType.MATCH]>,
): AlertStatus => {
  if (Boolean(formData.stadium) && Boolean(formData.stadium_name)) {
    return {
      success: false,
      message: "スタジアムは選択、または入力してください",
    };
  }

  return {
    success: true,
  };
};
