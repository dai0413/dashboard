import type { NationalTeamSummaryCache } from "../types";
import { useSummaryCache } from "../../../../../utils/summary/useSummaryCache";

const NATIONAL_TEAM_CACHE_KEYS = [
  "match",
  "player",
  "series",
  "playerPlot",
  "formationPlot",
] as const satisfies (keyof NationalTeamSummaryCache)[];

export const useNationalTeamSummaryCache = () => {
  return useSummaryCache<NationalTeamSummaryCache>(NATIONAL_TEAM_CACHE_KEYS);
};
