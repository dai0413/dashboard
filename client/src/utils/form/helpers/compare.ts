import { isKeyLabelObj } from "./label";

export const isSame = (a: any, b: any) => {
  if (isKeyLabelObj(a) && isKeyLabelObj(b)) return a.key === b.key;
  if (isKeyLabelObj(a) && !isKeyLabelObj(b)) return a.key === b;
  if (!isKeyLabelObj(a) && isKeyLabelObj(b)) return a === b.key;

  return a === b;
};
