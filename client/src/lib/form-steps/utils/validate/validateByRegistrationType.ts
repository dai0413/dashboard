import { FormTypeMap, ModelType } from "../../../../types/models";

export const validateByRegistrationType = (
  formData:
    | FormTypeMap[ModelType.PLAYER_REGISTRATION_HISTORY]
    | FormTypeMap[ModelType.STAFF_REGISTRATION_HISTORY],
) => {
  if (formData.registration_type === "register") {
    if (!formData.changes?.name) {
      return {
        success: false,
        message: "名前は必須です",
      };
    }
  } else if (formData.registration_type === "change") {
    if (!formData.changes) {
      return {
        success: false,
        message: "変更点がありません",
      };
    }
  }

  return {
    success: true,
  };
};
