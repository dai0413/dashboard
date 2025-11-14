import { MatchGet } from "../types/models/match";
import { TeamMatch } from "../types/types";

export const convertMatchToTeamMatch = (
  matchs: MatchGet[],
  teamId: string
): TeamMatch[] => {
  let teamMatchs = [];
  for (const match of matchs) {
    const {
      home_team,
      away_team,
      home_goal,
      away_goal,
      home_pk_goal,
      away_pk_goal,
      result,
      ...rest
    } = match;

    const isHome = match.home_team.id === teamId;

    const team = isHome ? home_team : away_team;
    const against_team = isHome ? away_team : home_team;
    const goal = isHome ? home_goal : away_goal;
    const against_goal = isHome ? away_goal : home_goal;
    const pk_goal = isHome ? home_pk_goal : away_pk_goal;
    const against_pk_goal = isHome ? away_pk_goal : home_pk_goal;

    let newResult: "勝ち" | "負け" | "分け" | "";
    if (match.result === "home") {
      newResult = isHome ? "勝ち" : "負け";
    } else if (match.result === "away") {
      newResult = isHome ? "負け" : "勝ち";
    } else if (match.result === "draw") {
      newResult = "分け";
    } else {
      continue;
    }

    const newTeamMatch: TeamMatch = {
      ...rest,
      result: newResult,
      team,
      against_team,
      goal,
      against_goal,
      pk_goal,
      against_pk_goal,
    };

    teamMatchs.push(newTeamMatch);
  }

  return teamMatchs;
};
