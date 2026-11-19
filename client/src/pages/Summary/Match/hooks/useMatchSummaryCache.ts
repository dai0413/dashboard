import type { MatchSummaryCache } from "../types";
import { useSummaryCache } from "../../../../utils/summary/useSummaryCache";

const MATCH_CACHE_KEYS = [
  "startingMember",
  "homeSubMember",
  "awaySubMember",
  "staffAppearance",
  "playerMatchEventLog",
  "staffMatchEventLog",
  "teamMatchFormation",
  "homeStatsL",
  "awayStatsL",
  "refereeAppearance",
] as const satisfies (keyof MatchSummaryCache)[];

export const useMatchSummaryCache = () => {
  return useSummaryCache<MatchSummaryCache>(MATCH_CACHE_KEYS);
};
