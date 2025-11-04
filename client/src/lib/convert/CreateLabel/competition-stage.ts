import { CompetitionStage } from "../../../types/models/competition-stage";

export const competitionStage = (t: CompetitionStage): string => {
  return t.name || "";
};
