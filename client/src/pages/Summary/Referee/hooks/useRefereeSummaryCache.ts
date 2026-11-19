import type { RefereeSummaryCache } from "../types";
import { useSummaryCache } from "../../../../utils/summary/useSummaryCache";

const REFEREE_CACHE_KEYS = [
  "selectedTab",
] as const satisfies (keyof RefereeSummaryCache)[];

export const useRefereeSummaryCache = () => {
  return useSummaryCache<RefereeSummaryCache>(REFEREE_CACHE_KEYS);
};
