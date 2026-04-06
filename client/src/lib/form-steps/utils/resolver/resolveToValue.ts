import { mapSelectableFields, SelectKey } from "./selectFields";

export const resolveToValue = <
  T extends Record<string, any>,
  Keys extends keyof T,
>(
  data: T[],
  targetKeys: readonly Keys[],
) => mapSelectableFields(data, SelectKey.ID, targetKeys);

export const resolveToLabel = <
  T extends Record<string, any>,
  Keys extends keyof T,
>(
  data: T[],
  targetKeys: readonly Keys[],
) => mapSelectableFields(data, SelectKey.LABEL, targetKeys);
