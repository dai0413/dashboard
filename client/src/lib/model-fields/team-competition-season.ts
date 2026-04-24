import { UIFieldDefinition } from "../../types/field";
import { TeamCompetitionSeasonGet } from "../../types/models/team-competition-season";
import { ColumnType } from "../../types/table";

export const teamCompetitionSeason: UIFieldDefinition<TeamCompetitionSeasonGet>[] =
  [
    {
      key: "team",
      field: "team",
      filterKey: "team.team",
      label: "チーム",
      type: "string",
      filterable: true,
      sortable: true,
      displayOnDetail: true,
      displayOnTable: true,
      getValueType: ColumnType.FIELD,
    },
    {
      key: "season",
      field: "season",
      filterKey: "season.name",
      label: "シーズン",
      type: "string",
      filterable: true,
      sortable: true,
      displayOnDetail: true,
      displayOnTable: true,
      getValueType: ColumnType.FIELD,
    },
    {
      key: "competition",
      field: "competition",
      filterKey: "competition.name",
      label: "大会名",
      type: "string",
      filterable: true,
      sortable: true,
      displayOnDetail: true,
      displayOnTable: true,
      getValueType: ColumnType.FIELD,
    },
    {
      key: "note",
      field: "note",
      label: "メモ",
      type: "string",
      filterable: true,
      sortable: true,
      displayOnDetail: true,
      displayOnTable: true,
      getValueType: ColumnType.FIELD,
    },
  ];
