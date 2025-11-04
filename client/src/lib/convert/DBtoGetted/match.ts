import { Match, MatchGet } from "../../../types/models/match";
import { competition } from "../CreateLabel/competition";
import { competitionStage } from "../CreateLabel/competition-stage";
import { matchFormat } from "../CreateLabel/match-format";
import { season } from "../CreateLabel/season";
import { stadium } from "../CreateLabel/stadium";
import { team } from "../CreateLabel/team";

export const match = (t: Match): MatchGet => {
  const newCompetition = {
    label: competition(t.competition),
    id: t.competition._id,
  };

  const competition_stage = {
    label: competitionStage(t.competition_stage),
    id: t.competition_stage._id,
  };

  const newSeason = {
    label: season(t.season),
    id: t.season._id,
  };

  const home_team = {
    label: team(t.home_team),
    id: t.home_team._id,
  };

  const away_team = {
    label: team(t.away_team),
    id: t.away_team._id,
  };

  const match_format = t.match_format
    ? {
        label: matchFormat(t.match_format),
        id: t.match_format._id,
      }
    : undefined;

  const newStadium = t.stadium
    ? {
        label: stadium(t.stadium),
        id: t.stadium._id,
      }
    : undefined;

  const date = typeof t.date === "string" ? new Date(t.date) : t.date;

  return {
    ...t,
    competition: newCompetition,
    competition_stage,
    season: newSeason,
    home_team,
    away_team,
    match_format,
    stadium: newStadium,
    date,
  };
};
