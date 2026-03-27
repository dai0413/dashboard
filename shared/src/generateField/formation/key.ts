import { sortPositions } from "../../sort";

export const key = (positions: string[]) => {
  return sortPositions(positions).join("-");
};
