import { convert } from "../../../lib/convert/CreateLabel";
import { OptionObj } from "../../../types/form/option";
import { ModelType } from "../../../types/models";
import { TeamCompetitionSeason } from "../../../types/models/team-competition-season";
import { ColumnType } from "../../../types/table";
import { TeamCompetitionSeasonOption } from "../types/model/team-competition-season";

export const teamCompetitionSeason = (
  data: TeamCompetitionSeason[],
): OptionObj<TeamCompetitionSeasonOption> => {
  const options: TeamCompetitionSeasonOption[] = data.map((d) => ({
    label: convert(ModelType.TEAM_COMPETITION_SEASON, d),
    key: d._id,

    team: {
      label: convert(ModelType.TEAM, d.team),
      id: d.team._id,
    },
    competition: {
      label: convert(ModelType.COMPETITION, d.competition),
      id: d.competition._id,
    },
    season: {
      label: convert(ModelType.SEASON, d.season),
      id: d.season._id,
    },
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
