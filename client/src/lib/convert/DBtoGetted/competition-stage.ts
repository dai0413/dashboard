import { stageType } from "@dai0413/myorg-shared";
import {
  CompetitionStage,
  CompetitionStageGet,
} from "../../../types/models/competition-stage";
import { competition } from "../CreateLabel/competition";
import { season } from "../CreateLabel/season";
import { competitionStage as createLabel } from "../CreateLabel/competition-stage";

export const competitionStage = (t: CompetitionStage): CompetitionStageGet => {
  const CompetitionStageType = stageType().find(
    (item) => item.key === t.stage_type,
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
    parent_stage: {
      label: t.parent_stage ? createLabel(t.parent_stage) : "",
      id: t.parent_stage?._id ?? undefined,
    },
  };
};
