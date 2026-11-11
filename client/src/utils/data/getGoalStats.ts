import { Label } from "@dai0413/myorg-shared";
import { GoalStats } from "../../pages/Summary/Competition/types";
import { MatchGet } from "../../types/models/match";

export const getGoalStats = (matches: MatchGet[]): GoalStats[] => {
  const statsMap = new Map<string, GoalStats>();

  const setStats = (
    team: Label,
    match: Label,
    goal: number,
    against_goal: number,
  ) => {
    if (!team.id || !match.id) return;

    const key = `${match.id}_${team.id}`;

    statsMap.set(key, {
      team,
      match,
      goal,
      against_goal,
    });
  };

  for (const match of matches) {
    setStats(
      match.home_team,
      { label: match.name, id: match._id },
      match.home_goal ?? 0,
      match.away_goal ?? 0,
    );

    setStats(
      match.away_team,
      { label: match.name, id: match._id },
      match.away_goal ?? 0,
      match.home_goal ?? 0,
    );
  }

  return [...statsMap.values()];
};
