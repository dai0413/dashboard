import { OptionArray, OptionTable } from "../../../types/option";
import { MatchGet } from "../../../types/models/match";

export const match = (
  data: MatchGet[],
  table: boolean,
): OptionArray | OptionTable => {
  const options = data.map((d) => ({
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
        { label: "大会", field: "competition" },
        { label: "大会ステージ", field: "competition_stage" },
        { label: "シーズン", field: "season" },
        { label: "節", field: "match_week" },
        { label: "ホーム", field: "home_team" },
        { label: "アウェイ", field: "away_team" },
      ],
      data: options,
    };
  }

  return options;
};
