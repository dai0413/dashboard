import { StatsLForm, StatsLGet } from "../../../types/models/stats-l";

export const statsL = (t: StatsLGet): StatsLForm => ({
  ...t,
  team: t.team.id,
  match: t.match.id,
});
