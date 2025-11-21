export const teamCheck = (
  formData: Record<string, any>,
  keyA: string,
  keyB: string
) => {
  if (!formData[keyA] && !formData[keyB]) {
    return {
      success: false,
      message: "チームを選択、または入力してください",
    };
  }

  if (
    formData.status &&
    formData.status !== "joined" &&
    !formData.left_reason
  ) {
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
