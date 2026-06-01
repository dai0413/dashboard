export const buildBulkDeleteMessage = (
  totalCount: number,
  successCount: number,
  failedCount: number,
) => {
  const parts: string[] = [];

  if (successCount === totalCount) {
    return `${totalCount}件すべて削除しました。`;
  }

  if (successCount > 0) {
    parts.push(`${totalCount}件中${successCount}件削除しました`);
  }

  if (failedCount > 0) {
    parts.push(`${failedCount}件削除できませんでした`);
  }

  if (parts.length === 0) {
    return "削除対象がありません";
  }

  return parts.join("。") + "。";
};
