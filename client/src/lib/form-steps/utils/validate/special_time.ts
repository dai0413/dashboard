import { FormTypeMap, ModelType } from "../../../../types/models";

export const validateExclusiveSpecialTime = (
  data: FormTypeMap[ModelType.PLAYER_MATCH_EVENT_LOG],
) => {
  if (data.special_time) {
    if (data.time) {
      return {
        success: false,
        message: "特別時間(special_time)を入力する場合はtimeを入力できません",
      };
    }

    if (data.add_time) {
      return {
        success: false,
        message:
          "特別時間(special_time)を入力する場合はadd_timeを入力できません",
      };
    }
  }
  return {
    success: true,
  };
};
