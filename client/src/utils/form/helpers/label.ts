export const isLabelObj = (val: any) =>
  typeof val === "object" && val && "key" in val && "label" in val;

export const getKey = (v: any) => (isLabelObj(v) ? v.key : v);
export const getLabel = (v: any) => (isLabelObj(v) ? v.label : v);
