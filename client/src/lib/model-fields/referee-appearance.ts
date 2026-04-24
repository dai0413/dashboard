import { UIFieldDefinition } from "../../types/field";
import { RefereeAppearanceGet } from "../../types/models/referee-appearance";
import { ColumnType } from "../../types/table";

export const refereeAppearance: UIFieldDefinition<RefereeAppearanceGet>[] = [
  {
    key: "match",
    field: "match",
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
    key: "referee",
    field: "referee",
    filterKey: "referee.name",
    label: "審判",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
  },
  {
    key: "role",
    field: "role",
    label: "役割",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
  },
];
