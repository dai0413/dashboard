export const isKeyLabelObj = (val: any) =>
  typeof val === "object" && val && "key" in val && "label" in val;

export const getKey = (v: any) => (isKeyLabelObj(v) ? v.key : v);
export const getLabel = (v: any) => (isKeyLabelObj(v) ? v.label : v);
