import { isLabelObj } from "./label";

export const isSame = (a: any, b: any) => {
  if (isLabelObj(a) && isLabelObj(b)) return a.key === b.key;
  if (isLabelObj(a) && !isLabelObj(b)) return a.key === b;
  if (!isLabelObj(a) && isLabelObj(b)) return a === b.key;

  return a === b;
};
