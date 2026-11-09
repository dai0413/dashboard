import { convert } from "../../../lib/convert/CreateLabel";
import { OptionObj } from "../../../types/form/option";
import { ModelType } from "../../../types/models";
import { CompetitionStage } from "../../../types/models/competition-stage";
import { ColumnType } from "../../../types/table";
import { CompetitionStageOption } from "../types/model/competition-stage";

export const competitionStage = (
  data: CompetitionStage[],
): OptionObj<CompetitionStageOption> => {
  const options: CompetitionStageOption[] = data.map((d) => ({
    label: convert(ModelType.COMPETITION_STAGE, d),
    key: d._id,
    season: convert(ModelType.SEASON, d.season),
  }));

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
};
