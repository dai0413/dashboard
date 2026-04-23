import { OptionArray, OptionTable } from "../../../types/option";
import { MatchGet } from "../../../types/models/match";
import { Label } from "@dai0413/myorg-shared";
import { ColumnType } from "../../../types/table";

type Option = {
  label: string;
  key: string;
  competition: string;
  competition_stage: Label;
  season: string;
  match_week: number | undefined;
  home_team: string;
  away_team: string;
};

export const match = (
  data: MatchGet[],
  table: boolean,
): OptionArray | OptionTable<Option> => {
  const options: Option[] = data.map((d) => ({
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

  if (table === true) {
    return {
      header: [
        {
          label: "大会",
          field: "competition",
          type: ColumnType.FIELD,
          id: "competition",
          defaultDisplay: true,
        },
        {
          label: "大会ステージ",
          field: "competition_stage",
          type: ColumnType.FIELD,
          id: "competition_stage",
          defaultDisplay: true,
        },
        {
          label: "シーズン",
          field: "season",
          type: ColumnType.FIELD,
          id: "season",
          defaultDisplay: true,
        },
        {
          label: "節",
          field: "match_week",
          type: ColumnType.FIELD,
          id: "match_week",
          defaultDisplay: true,
        },
        {
          label: "ホーム",
          field: "home_team",
          type: ColumnType.FIELD,
          id: "home_team",
          defaultDisplay: true,
        },
        {
          label: "アウェイ",
          field: "away_team",
          type: ColumnType.FIELD,
          id: "away_team",
          defaultDisplay: true,
        },
      ],
      data: options,
    };
  }

  return options;
};
