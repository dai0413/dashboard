import { NationalCallupForm } from "../../../../../types/models/national-callup";

export const leftReasonCheck = (formData: NationalCallupForm) => {
  if (formData.status !== "joined" && !formData.left_reason) {
    return {
      success: false,
      message: "離脱理由を入力してください",
    };
  }

  return {
    success: true,
    message: "",
  };
};
