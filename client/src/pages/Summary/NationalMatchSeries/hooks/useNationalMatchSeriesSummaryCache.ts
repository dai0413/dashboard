import type { NationalMatchSeriesSummaryCache } from "../types";
import { useSummaryCache } from "../../../../utils/summary/useSummaryCache";

const NATIONAL_MATCH_SERIES_CACHE_KEYS = [
  "selectedTab",
  "match",
  "nationalCallup",
] as const satisfies (keyof NationalMatchSeriesSummaryCache)[];

export const useNationalMatchSeriesSummaryCache = () => {
  return useSummaryCache<NationalMatchSeriesSummaryCache>(
    NATIONAL_MATCH_SERIES_CACHE_KEYS,
  );
};
