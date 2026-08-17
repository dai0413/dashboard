export enum UpdateMode {
  REPLACE = "replace",
  TOGGLE = "toggle",
  ARRAY_UPDATE = "arrayUpdate",
}

export type UpdateData<FORM extends object> = FORM & { _id: string };
