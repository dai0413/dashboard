import { TransferForm } from "../../../../../types/models/transfer";

const xor = (formData: Record<string, any>, keyA: string, keyB: string) => {
  const hasA = !!formData[keyA];
  const hasB = !!formData[keyB];

  // 両方空 → OK（未入力は許す）
  if (!hasA && !hasB) {
    return { success: true, message: "" };
  }

  // どちらか1つだけ → OK（XOR）
  if (hasA !== hasB) {
    return { success: true, message: "" };
  }

  // 両方ある → NG
  return {
    success: false,
    message: `${keyA}, ${keyB} のどちらか1つだけ入力してください`,
  };
};

export const teamCheck = (formData: TransferForm) => {
  // from系 or to系 のどれか1つでも入力されているか？
  const require =
    !!formData.from_team ||
    !!formData.from_team_name ||
    !!formData.to_team ||
    !!formData.to_team_name;

  if (!require) {
    return {
      success: false,
      message: "所属元 または 所属先 のいずれかを入力してください。",
    };
  }

  // from系の XOR（入力されている場合のみチェック）
  const from_teamCheck = xor(formData, "from_team", "from_team_name");
  if (!from_teamCheck.success) {
    return from_teamCheck;
  }

  // to系の XOR（入力されている場合のみチェック）
  const to_teamCheck = xor(formData, "to_team", "to_team_name");
  if (!to_teamCheck.success) {
    return to_teamCheck;
  }

  return {
    success: true,
    message: "",
  };
};
