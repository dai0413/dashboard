import { OptionArray, OptionTable } from "../../../types/option";
import { CompetitionStageGet } from "../../../types/models/competition-stage";

export const competitionStage = (
  data: CompetitionStageGet[],
  table: boolean
): OptionArray | OptionTable => {
  const options = data.map((d) => ({
    label: `${d.competition.label}-${d.name}`,
    key: d._id,
    leg: d.leg,
    stageType: d.stage_type,
  }));

  if (table === true) {
    return {
      header: [
        { label: "シリーズ名", field: "label" },
        { label: "国名", field: "country" },
        { label: "年代・種別", field: "age_group" },
      ],
      data: options,
    };
  }

  return options;
};
