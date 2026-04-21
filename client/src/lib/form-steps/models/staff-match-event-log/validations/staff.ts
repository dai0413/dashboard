import { FormTypeMap, ModelType } from "../../../../../types/models";

export const validateStaffRequiredForEvent = (
  data: FormTypeMap[ModelType.STAFF_MATCH_EVENT_LOG],
) => {
  if (
    data.match_event_type !== "オウンゴール" &&
    !data.staff &&
    !data.staff_name
  ) {
    return {
      success: false,
      message: "スタッフを選択・または入力してください",
    };
  }
  return {
    success: true,
  };
};
