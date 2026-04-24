import { UIFieldDefinition } from "../../types/field";
import { TeamMatchFormationGet } from "../../types/models/team-match-formation";
import { ColumnType } from "../../types/table";

export const teamMatchFormation: UIFieldDefinition<TeamMatchFormationGet>[] = [
  {
    key: "team",
    field: "team",
    width: "70px",
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
    key: "match",
    field: "match",
    width: "150px",
    filterKey: "match",
    label: "試合",
    type: "select",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
  },
  {
    key: "formation",
    field: "formation",
    width: "70px",
    filterKey: "formation.name",
    label: "フォーメーション名",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
  },
];
