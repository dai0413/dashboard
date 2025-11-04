import { Match } from "../../../types/models/match";
import { competition } from "./competition";
import { competitionStage } from "./competition-stage";
import { season } from "./season";
import { team } from "./team";

export const match = (t: Match): string => {
  return `${competition(t.competition)}-${season(t.season)}-${competitionStage(
    t.competition_stage
  )}-${t.match_week}-${team(t.home_team)}-${team(t.away_team)}}`;
};
