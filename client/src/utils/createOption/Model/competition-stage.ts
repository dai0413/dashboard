import { OptionArray, OptionTable } from "../../../types/form/option";
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
      fields: [
        {
          label: "シリーズ名",
          field: "label",
          width: "200px",
          getValueType: ColumnType.FIELD,
          key: "label",
          displayOnTable: true,
          type: "string",
        },
        {
          label: "シーズン",
          field: "season",
          width: "80px",
          getValueType: ColumnType.FIELD,
          key: "season",
          displayOnTable: true,
          type: "string",
        },
      ],
      data: options,
    };
  }

  return options;
};
