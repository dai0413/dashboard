import { Transfer } from "../../../types/models/transfer";

export const transfer = (t: Transfer): string => {
  return `${t._id}`;
};
