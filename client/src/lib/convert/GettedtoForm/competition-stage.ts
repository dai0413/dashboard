import {
  CompetitionStageForm,
  CompetitionStageGet,
} from "../../../types/models/competition-stage";

export const competitionStage = (
  t: CompetitionStageGet
): CompetitionStageForm => ({
  ...t,
  competition: t.competition.id,
  season: t.season.id,
});
