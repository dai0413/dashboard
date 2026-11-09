import { convert } from "../../../lib/convert/CreateLabel";
import { OptionObj } from "../../../types/form/option";
import { ModelType } from "../../../types/models";
import { Match } from "../../../types/models/match";
import { ColumnType } from "../../../types/table";
import { MatchOption } from "../types/model/match";

export const match = (data: Match[]): OptionObj<MatchOption> => {
  const options: MatchOption[] = data.map((d) => ({
    label: convert(ModelType.MATCH, d),
    key: d._id,
    competition: convert(ModelType.COMPETITION, d.competition),
    competition_stage: {
      id: d.competition_stage._id,
      label: convert(ModelType.COMPETITION_STAGE, d.competition_stage),
    },
    season: convert(ModelType.SEASON, d.season),
    match_week: d.match_week,
    home_team: convert(ModelType.TEAM, d.home_team),
    away_team: convert(ModelType.TEAM, d.away_team),
  }));

  return {
    fields: [
      {
        label: "大会",
        field: "competition",
        getValueType: ColumnType.FIELD,
        key: "competition",
        displayOnTable: true,
        type: "string",
      },
      {
        label: "大会ステージ",
        field: "competition_stage",
        getValueType: ColumnType.FIELD,
        key: "competition_stage",
        displayOnTable: true,
        type: "string",
      },
      {
        label: "シーズン",
        field: "season",
        getValueType: ColumnType.FIELD,
        key: "season",
        displayOnTable: true,
        type: "string",
      },
      {
        label: "節",
        field: "match_week",
        getValueType: ColumnType.FIELD,
        key: "match_week",
        displayOnTable: true,
        type: "string",
      },
      {
        label: "ホーム",
        field: "home_team",
        getValueType: ColumnType.FIELD,
        key: "home_team",
        displayOnTable: true,
        type: "string",
      },
      {
        label: "アウェイ",
        field: "away_team",
        getValueType: ColumnType.FIELD,
        key: "away_team",
        displayOnTable: true,
        type: "string",
      },
    ],
    data: options,
  };
};
