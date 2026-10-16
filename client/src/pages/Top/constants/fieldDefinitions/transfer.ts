import { ColumnType } from "../../../../types/table";
import { UIFieldDefinition } from "../../../../types/field";
import { TransferGet } from "../../../../types/models/transfer";

export const transfer: UIFieldDefinition<TransferGet>[] = [
  {
    label: "発表日",
    field: "doa",
    getValueType: ColumnType.FIELD,
    key: "doa",
    displayOnTable: true,
    type: "Date",
  },
  {
    label: "移籍元",
    field: "from_team",
    getValueType: ColumnType.FIELD,
    key: "from_team",
    displayOnTable: true,
    type: "string",
  },
  {
    label: "移籍先",
    field: "to_team",
    getValueType: ColumnType.FIELD,
    key: "to_team",
    displayOnTable: true,
    type: "string",
  },
  {
    label: "名前",
    field: "player",
    getValueType: ColumnType.FIELD,
    key: "player",
    displayOnTable: true,
    type: "string",
  },
];
