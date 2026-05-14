import { OptionObj } from "../../../types/form/option";
import { MatchGet } from "../../../types/models/match";
import { ColumnType } from "../../../types/table";
import { Match } from "../types/model/match";

export const match = (data: MatchGet[]): OptionObj<Match> => {
  const options: Match[] = data.map((d) => ({
    label: `${d.competition.label}-
            ${d.competition_stage.label}-
            ${d.season.label}-
            ${d.match_week}-
            ${d.home_team.label}-
            ${d.away_team.label}`,
    key: d._id,
    competition: d.competition.label,
    competition_stage: d.competition_stage,
    season: d.season.label,
    match_week: d.match_week,
    home_team: d.home_team.label,
    away_team: d.away_team.label,
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
