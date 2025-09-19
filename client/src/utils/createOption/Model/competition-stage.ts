import { OptionArray, OptionTable } from "../../../types/option";
import { CompetitionStageGet } from "../../../types/models/competition-stage";

export const competitionStage = (
  data: CompetitionStageGet[],
  table: boolean
): OptionArray | OptionTable => {
  const options = data.map((d) => ({
    label: `${d.competition.label} ${d.name ? d.name : ""}`,
    key: d._id,
    season: d.season.label,
  }));

  if (table === true) {
    return {
      header: [
        { label: "シリーズ名", field: "label", width: "200px" },
        { label: "シーズン", field: "season", width: "80px" },
      ],
      data: options,
    };
  }

  return options;
};
