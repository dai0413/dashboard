import { SortableFieldDefinition } from "@dai0413/myorg-shared";

export const buildJsonSort = (sorts: SortableFieldDefinition[] = []) => {
  if (!Array.isArray(sorts) || sorts.length === 0) return {};

  const sortObj: Record<string, 1 | -1> = {};

  for (const s of sorts) {
    if (!s.sortable || s.asc == null) continue; // ソート対象外
    sortObj[s.key] = s.asc ? 1 : -1; // asc=true → 昇順, false → 降順
  }

  return sortObj;
};
