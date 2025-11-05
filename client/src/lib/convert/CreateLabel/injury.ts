import { Injury } from "../../../types/models/injury";

export const injury = (t: Injury): string => {
  return `${t._id}`;
};
