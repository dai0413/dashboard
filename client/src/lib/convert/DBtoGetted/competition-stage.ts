import { stageType } from "@dai0413/myorg-shared";
import {
  CompetitionStage,
  CompetitionStageGet,
} from "../../../types/models/competition-stage";
import { competition } from "../CreateLabel/competition";
import { season } from "../CreateLabel/season";

export const competitionStage = (t: CompetitionStage): CompetitionStageGet => {
  const CompetitionStageType = stageType().find(
    (item) => item.key === t.stage_type
  )?.label;

  return {
    ...t,
    competition: {
      label: competition(t.competition),
      id: t.competition?._id ?? undefined,
    },
    season: {
      label: season(t.season),
      id: t.season?._id ?? undefined,
    },
    stage_type: CompetitionStageType ? CompetitionStageType : "",
  };
};
