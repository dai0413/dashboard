import { OptionObj } from "../../../types/form/option";
import { TeamCompetitionSeasonGet } from "../../../types/models/team-competition-season";
import { ColumnType } from "../../../types/table";
import { TeamCompetitionSeason } from "../types/model/team-competition-season";

export const teamCompetitionSeason = (
  data: TeamCompetitionSeasonGet[],
): OptionObj<TeamCompetitionSeason> => {
  const options: TeamCompetitionSeason[] = data.map((d) => ({
    label: `${d.season.label}-${d.competition.label}-${d.team.label}`,
    key: d._id,

    team: d.team,
    competition: d.competition,
    season: d.season,
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
        label: "シーズン",
        field: "season",
        getValueType: ColumnType.FIELD,
        key: "season",
        displayOnTable: true,
        type: "string",
      },
      {
        label: "チーム",
        field: "team",
        getValueType: ColumnType.FIELD,
        key: "team",
        displayOnTable: true,
        type: "string",
      },
    ],
    data: options,
  };
};
