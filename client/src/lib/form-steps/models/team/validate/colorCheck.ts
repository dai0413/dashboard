import { TeamForm } from "../../../../../types/models/team";

const hexColorPattern = /^#[0-9A-Fa-f]{6}$/;

export const colorCheck = (formData: TeamForm) => {
  const colorFields = [
    formData.primaryColor,
    formData.secondaryColor,
    formData.tertiaryColor,
  ];

  const hasInvalidColor = colorFields.some(
    (color) => color && !hexColorPattern.test(color),
  );

  if (hasInvalidColor) {
    return {
      success: false,
      message: "色は正式な入力形式で入力してください (#RRGGBB)",
    };
  }

  return {
    success: true,
    message: "",
  };
};
