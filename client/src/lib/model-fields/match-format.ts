import { FieldDefinition } from "../../types/field";
import { MatchFormatGet } from "../../types/models/match-format";
import { periodField } from "../../utils/displayField/periodField";

export const matchFormat: FieldDefinition[] = [
  {
    key: "name",
    label: "試合フォーマット",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: (d: MatchFormatGet) => periodField(d, "前半"),
    label: "前半",
    type: "string",
    filterable: false,
    sortable: false,
    displayOnDetail: true,
  },
  {
    key: (d: MatchFormatGet) => periodField(d, "後半"),
    label: "後半",
    type: "string",
    filterable: false,
    sortable: false,
    displayOnDetail: true,
  },
  {
    key: (d: MatchFormatGet) => periodField(d, "延長前半"),
    label: "延長前半",
    type: "string",
    filterable: false,
    sortable: false,
    displayOnDetail: true,
  },
  {
    key: (d: MatchFormatGet) => periodField(d, "延長後半"),
    label: "延長後半",
    type: "string",
    filterable: false,
    sortable: false,
    displayOnDetail: true,
  },
  {
    key: (d: MatchFormatGet) => periodField(d, "3部"),
    label: "3部",
    type: "string",
    filterable: false,
    sortable: false,
    displayOnDetail: true,
  },
  {
    key: (d: MatchFormatGet) => periodField(d, "4部"),
    label: "4部",
    type: "string",
    filterable: false,
    sortable: false,
    displayOnDetail: true,
  },
  {
    key: (d: MatchFormatGet) => periodField(d, "PK"),
    label: "PK",
    type: "string",
    filterable: false,
    sortable: false,
    displayOnDetail: true,
  },
  {
    key: (d: MatchFormatGet) => periodField(d, "ゴールデンボール"),
    label: "GB",
    type: "string",
    filterable: false,
    sortable: false,
    displayOnDetail: true,
  },
];
