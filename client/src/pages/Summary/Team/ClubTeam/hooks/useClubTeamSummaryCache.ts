import type { ClubTeamSummaryCache } from "../types";
import { useSummaryCache } from "../../../../../utils/summary/useSummaryCache";

const CLUB_TEAM_CACHE_KEYS = [
  "selectedTab",
  "seasonDate",
  "selectedteamCompetitionSeason",
  "player",
  "future_in",
  "transfer_in",
  "transfer_out",
  "loan",
  "injury",
  "match",
  "playerRegistration",
  "statsL",
  "staffRegistration",
  "radarData",
  "linePlot",
  "teamCompetitionSeason",
  "appearancePlot",
  "birthYearPositionMatrix",
  "formationPlot",
  "playerStatistics",
] as const satisfies (keyof ClubTeamSummaryCache)[];

export const useClubTeamSummaryCache = () => {
  return useSummaryCache<ClubTeamSummaryCache>(CLUB_TEAM_CACHE_KEYS);
};
