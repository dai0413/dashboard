import type { CompetitionSummaryCache } from "../types";
import { useSummaryCache } from "../../../../utils/summary/useSummaryCache";

const COMPETITION_CACHE_KEYS = [
  "selectedSeason",
  "season",
  "competitionStage",
  "teamCompetitionSeason",
  "match",
  "playerRegistration",
  "staffRegistration",
  "playerStatistic",
  "statsL",
] as const satisfies (keyof CompetitionSummaryCache)[];

export const useCompetitionSummaryCache = () => {
  return useSummaryCache<CompetitionSummaryCache>(COMPETITION_CACHE_KEYS);
};
