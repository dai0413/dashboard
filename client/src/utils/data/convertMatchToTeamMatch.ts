import { MatchGet } from "../../types/models/match";
import { TeamMatch } from "../../types/types";

export const convertMatchToTeamMatch = (
  matches: MatchGet[],
  teamId: string,
): TeamMatch[] => {
  let teamMatchs = [];
  for (const match of matches) {
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
    if (typeof goal === "number" && typeof against_goal === "number") {
      if (goal > against_goal) {
        newResult = "勝ち";
      } else if (goal < against_goal) {
        newResult = "負け";
      } else if (goal === against_goal) {
        newResult = "分け";

        if (
          typeof pk_goal === "number" &&
          typeof against_pk_goal === "number"
        ) {
          if (pk_goal > against_goal) {
            newResult = "勝ち";
          } else if (pk_goal < against_goal) {
            newResult = "負け";
          } else {
            continue;
          }
        }
      } else {
        continue;
      }
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
