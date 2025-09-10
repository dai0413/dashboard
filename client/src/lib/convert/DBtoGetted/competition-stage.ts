import {
  CompetitionStage,
  CompetitionStageGet,
} from "../../../types/models/competition-stage";
import { stageType } from "../../../utils/createOption/Enum/stageType";

export const competitionStage = (t: CompetitionStage): CompetitionStageGet => {
  const CompetitionStageType = stageType().find(
    (item) => item.key === t.stage_type
  )?.label;

  return {
    ...t,
    competition: {
      label: t.competition?.name ?? "不明",
      id: t.competition?._id ?? "",
    },
    season: {
      label: t.season?.name ?? "不明",
      id: t.season?._id ?? "",
    },
    stage_type: CompetitionStageType ? CompetitionStageType : "",
  };
};
