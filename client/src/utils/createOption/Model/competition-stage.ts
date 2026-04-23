import { OptionArray, OptionTable } from "../../../types/option";
import { CompetitionStageGet } from "../../../types/models/competition-stage";
import { ColumnType } from "../../../types/table";
import { CompetitionStage } from "../types/optionTable/competition-stage";

export const competitionStage = (
  data: CompetitionStageGet[],
  table: boolean,
): OptionArray | OptionTable<CompetitionStage> => {
  const options: CompetitionStage[] = data.map((d) => ({
    label: `${d.competition.label} ${d.name ? d.name : ""}`,
    key: d._id,
    season: d.season.label,
  }));

  if (table === true) {
    return {
      header: [
        {
          label: "シリーズ名",
          field: "label",
          width: "200px",
          type: ColumnType.FIELD,
          id: "label",
          defaultDisplay: true,
        },
        {
          label: "シーズン",
          field: "season",
          width: "80px",
          type: ColumnType.FIELD,
          id: "season",
          defaultDisplay: true,
        },
      ],
      data: options,
    };
  }

  return options;
};
