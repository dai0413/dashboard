import { FilterableFieldDefinition } from "@dai0413/myorg-shared";

export const toggleQuickFilter = (
  filterCondition: FilterableFieldDefinition,
  filterConditions: FilterableFieldDefinition[],
  removeKey?: string[],
) => {
  const existing = filterConditions.find((f) => f.key === filterCondition.key);

  // すでにあるが別の値 → 更新
  if (existing) {
    return filterConditions.map((f) =>
      f.key === filterCondition.key
        ? {
            ...f,
            ...filterCondition,
          }
        : f,
    );
  }

  // 存在しない → 新規追加
  const newCondition = [
    ...filterConditions.filter((p) => !removeKey?.includes(p.key)),
    filterCondition,
  ];

  return newCondition;
};
