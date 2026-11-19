import type { PlayerSummaryCache } from "../types";
import { useSummaryCache } from "../../../../utils/summary/useSummaryCache";

const PLAYER_CACHE_KEYS = [
  "selectedTab",
  "transfer",
  "injury",
  "playerRegistration",
  "nationalCallup",
  "statistics",
] as const satisfies (keyof PlayerSummaryCache)[];

export const usePlayerSummaryCache = () => {
  return useSummaryCache<PlayerSummaryCache>(PLAYER_CACHE_KEYS);
};
