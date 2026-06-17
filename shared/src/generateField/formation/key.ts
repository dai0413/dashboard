import { sortPositions } from "../../sort/index.js";

export const key = (positions: string[]) => {
  return sortPositions(positions).join("-");
};
