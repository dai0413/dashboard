import { isLabelObject } from ".";

type Comparison = string | number | (string | number)[];

const getComparison = (value: any): Comparison => {
  if (Array.isArray(value)) {
    // 配列: 各要素が Label 型なら id を抽出、その他はそのまま
    return value.map((item) => (item && isLabelObject(item) ? item.id : item));
  }

  if (value && isLabelObject(value)) {
    return value.id;
  }

  return value ?? ""; // null や undefined は空として扱う
};

const isEqual = (a: any, b: any): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return [...a].sort().join() === [...b].sort().join();
  }

  return a === b;
};

export const objectIsEqual = (form: any, selected: any) => {
  const formComparison = getComparison(form);
  const selectedComparison = getComparison(selected);

  return isEqual(formComparison, selectedComparison);
};
