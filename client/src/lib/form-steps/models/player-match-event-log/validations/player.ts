import { FormTypeMap, ModelType } from "../../../../../types/models";

export const validatePlayerRequiredForEvent = (
  data: FormTypeMap[ModelType.PLAYER_MATCH_EVENT_LOG],
  formLabel?: Record<string, any>,
) => {
  if (
    formLabel?.match_event_type !== "オウンゴール" &&
    !data.player &&
    !data.player_name
  ) {
    return {
      success: false,
      message: "選手を選択・または入力してください",
    };
  }
  return {
    success: true,
  };
};
