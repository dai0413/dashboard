import { FilterableFieldDefinition } from "@dai0413/myorg-shared";

export const toggleQuickFilter = (
  newFilterConditions: FilterableFieldDefinition[],
  filterConditions: FilterableFieldDefinition[],
  removeKey?: string[],
): FilterableFieldDefinition[] => {
  // removeKey対象を削除
  let result = filterConditions.filter((f) => !removeKey?.includes(f.key));

  for (const newCondition of newFilterConditions) {
    const index = result.findIndex((f) => f.key === newCondition.key);

    if (index >= 0) {
      // 更新
      result[index] = {
        ...result[index],
        ...newCondition,
      };
    } else {
      // 追加
      result.push(newCondition);
    }
  }

  return result;
};
