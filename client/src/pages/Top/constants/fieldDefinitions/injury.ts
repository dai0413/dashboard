import { ColumnType } from "../../../../types/table";
import { UIFieldDefinition } from "../../../../types/field";
import { InjuryGet } from "../../../../types/models/injury";

export const injury: UIFieldDefinition<InjuryGet>[] = [
  {
    label: "発表日",
    field: "doa",
    getValueType: ColumnType.FIELD,
    key: "doa",
    displayOnTable: true,
    type: "Date",
  },
  {
    label: "名前",
    field: "player",
    getValueType: ColumnType.FIELD,
    key: "player",
    displayOnTable: true,
    type: "string",
  },
  {
    label: "負傷箇所",
    field: "injured_part",
    getValueType: ColumnType.FIELD,
    key: "injured_part",
    displayOnTable: true,
    type: "string",
  },
];
