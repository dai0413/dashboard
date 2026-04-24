import { position_formation } from "@dai0413/myorg-shared";
import { UIFieldDefinition } from "../../types/field";
import { FormationGet } from "../../types/models/formation";
import { ColumnType } from "../../types/table";

const getData = (data: FormationGet, position: string): string => {
  return data.position_formation.findIndex((f) => f === position) > -1
    ? "◯"
    : "";
};

const positions = position_formation();
const fields = positions.map((p) => ({
  getValueType: ColumnType.CUSTOM,
  id: p.key,
  label: p.key,
  getData: (data: FormationGet) => getData(data, p.key),
  width: "70px",
  defaultDisplay: false,
  displayOnTable: false,
  key: p.key,
  type: "string",
})) satisfies UIFieldDefinition<FormationGet>[];

export const formation: UIFieldDefinition<FormationGet>[] = [
  {
    key: "name",
    field: "name",
    width: "60px",
    label: "フォーメーション名",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
  },
  {
    key: "position_formation",
    field: "position_formation",
    label: "ポジション",
    type: "string",
    filterable: false,
    sortable: false,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
  },
  {
    key: "key",
    field: "key",
    label: "キー",
    type: "string",
    filterable: true,
    sortable: false,
    displayOnDetail: true,
    displayOnTable: false,
    getValueType: ColumnType.FIELD,
  },
  ...fields,
  {
    key: "old_id",
    field: "old_id",
    label: "旧id",
    type: "string",
    filterable: false,
    sortable: false,
    displayOnDetail: true,
    displayOnTable: false,
    getValueType: ColumnType.FIELD,
  },
];
