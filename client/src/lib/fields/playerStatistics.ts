import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { UIFieldDefinition } from "../../types/field";
import { ColumnType } from "../../types/table";
import { convert } from "../convert/CreateLabel";
import { ModelType } from "../../types/models";

export const playerStatistics: UIFieldDefinition<PlayerStatistic>[] = [
  {
    key: "player",
    filterKey: "player.name",
    label: "選手",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.CUSTOM,
    getData: (d) => ({
      id: d.player._id,
      label: convert(ModelType.PLAYER, d.player),
    }),
    width: "100px",
  },
  {
    key: "teams",
    label: "チーム",
    type: "number",
    displayOnTable: true,
    filterable: true,
    sortable: true,
    getValueType: ColumnType.CUSTOM,
    getData: (d) => {
      const values = d.teams.map((team) => {
        return {
          id: team._id,
          label: convert(ModelType.TEAM, team),
        };
      });

      return values;
    },
    width: "50px",
  },
  {
    key: "mainPosition",
    label: "メイン",
    type: "string",
    displayOnTable: true,
    filterable: true,
    sortable: true,
    getValueType: ColumnType.FIELD,
    field: "mainPosition",
    width: "50px",
  },
  {
    key: "appearances",
    label: "試合数",
    type: "number",
    displayOnTable: true,
    filterable: true,
    sortable: true,
    getValueType: ColumnType.FIELD,
    field: "appearances",
    width: "50px",
  },
  {
    key: "starts",
    label: "スタメン",
    type: "number",
    displayOnTable: true,
    filterable: true,
    sortable: true,
    getValueType: ColumnType.FIELD,
    field: "starts",
    width: "50px",
  },
  {
    key: "subs",
    label: "サブ",
    type: "number",
    displayOnTable: true,
    filterable: true,
    sortable: true,
    getValueType: ColumnType.FIELD,
    field: "subs",
    width: "50px",
  },
  {
    key: "bench",
    label: "ベンチ",
    type: "number",
    displayOnTable: true,
    filterable: true,
    sortable: true,
    getValueType: ColumnType.FIELD,
    field: "bench",
    width: "50px",
  },
  {
    key: "minutes",
    label: "時間",
    type: "number",
    displayOnTable: true,
    filterable: true,
    sortable: true,
    getValueType: ColumnType.FIELD,
    field: "minutes",
    width: "50px",
  },
  {
    key: "goals",
    label: "得点",
    type: "number",
    displayOnTable: true,
    filterable: true,
    sortable: true,
    getValueType: ColumnType.FIELD,
    field: "goals",
    width: "50px",
  },
  {
    key: "assists",
    label: "アシスト",
    type: "number",
    displayOnTable: true,
    filterable: true,
    sortable: true,
    getValueType: ColumnType.FIELD,
    field: "assists",
    width: "50px",
  },
  {
    key: "group.season",
    label: "シーズン",
    type: "string",
    displayOnTable: true,
    filterable: true,
    sortable: true,
    getValueType: ColumnType.CUSTOM,
    getData: (d) => {
      if (d.group && d.group.by === "season" && d.group.data) {
        return {
          id: d.group.data._id,
          label: convert(ModelType.SEASON, d.group.data),
        };
      }
      return "";
    },
    width: "50px",
  },
  {
    key: "group.season.competition",
    label: "大会",
    type: "string",
    displayOnTable: true,
    filterable: true,
    sortable: true,
    getValueType: ColumnType.CUSTOM,
    getData: (d) => {
      if ("group" in d && d.group && d.group.by === "season") {
        return {
          id: d.group.data.competition._id,
          label: convert(ModelType.COMPETITION, d.group.data.competition),
        };
      }
      return "";
    },
    width: "50px",
  },
];
