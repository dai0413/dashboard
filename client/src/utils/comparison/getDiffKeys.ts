import { isComparableEqual } from "./isCompareableEqual";

export const getDiffKeys = (selected: Object, formData: Object): string[] => {
  const diff: string[] = [];
  for (const [key, formValue] of Object.entries(formData)) {
    const typedKey = key as keyof typeof formData;
    const selectedValue = selected[typedKey];

    !isComparableEqual(formValue, selectedValue) && diff.push(key);
  }

  return diff;
};
