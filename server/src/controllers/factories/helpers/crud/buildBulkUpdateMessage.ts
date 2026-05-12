export const buildBulkUpdateMessage = (
  totalCount: number,
  successCount: number,
  failedCount: number,
) => {
  const parts: string[] = [];

  if (successCount === totalCount) {
    return `${totalCount}件すべて更新しました。`;
  }

  // 成功メッセージ
  if (successCount > 0) {
    parts.push(`${totalCount}件中${successCount}件更新しました`);
  }

  // 失敗メッセージ
  if (failedCount > 0) {
    parts.push(`${failedCount}件修正してください`);
  }

  // 全部0（ほぼないけど保険）
  if (parts.length === 0) {
    return "更新対象がありません";
  }

  return parts.join("。") + "。";
};
