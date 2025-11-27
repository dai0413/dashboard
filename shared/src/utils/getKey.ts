import { OptionArray } from "../types/options.js";

export const getKey = (data: OptionArray): string[] => {
  return data.map((d) => d.key);
};
