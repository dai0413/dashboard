import { Staff } from "../../../types/models/staff";

export const staff = (p: Staff): string => {
  if (p.name) return p.name;
  if (p.en_name) return p.en_name;
  return "";
};
