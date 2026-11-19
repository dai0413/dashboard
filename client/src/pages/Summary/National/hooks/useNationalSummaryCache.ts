import type { NationalSummaryCache } from "../types";
import { useSummaryCache } from "../../../../utils/summary/useSummaryCache";

const NATIONAL_CACHE_KEYS = [
  "competition",
  "team",
  "nationalMatchSeries",
] as const satisfies (keyof NationalSummaryCache)[];

export const useNationalSummaryCache = () => {
  return useSummaryCache<NationalSummaryCache>(NATIONAL_CACHE_KEYS);
};
