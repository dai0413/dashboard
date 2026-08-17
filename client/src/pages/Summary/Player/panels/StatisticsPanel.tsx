import TableClient from "../../../../components/table/TableClient";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { UIFieldDefinition } from "../../../../types/field";
import { ColumnType } from "../../../../types/table";
import { UsePlayerSummary } from "../types";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";

const convert = (p: PlayerStatistic["player"]): string => {
  if (p.name) return p.name;
  if (p.en_name) return p.en_name;
  return "";
};

const fieldDefinitions: UIFieldDefinition<PlayerStatistic>[] = [
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
    getData: (d) => ({ id: d.player._id, label: convert(d.player) }),
    width: "100px",
  },
  {
    key: "mainPosition",
    label: "メイン",
    type: "string",
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
    field: "mainPosition",
    width: "50px",
  },
  {
    key: "appearances",
    label: "試合数",
    type: "number",
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
    field: "appearances",
    width: "50px",
  },
  {
    key: "starts",
    label: "スタメン",
    type: "number",
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
    field: "starts",
    width: "50px",
  },
  {
    key: "subs",
    label: "サブ",
    type: "number",
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
    field: "subs",
    width: "50px",
  },
  {
    key: "bench",
    label: "ベンチ",
    type: "number",
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
    field: "bench",
    width: "50px",
  },
  {
    key: "minutes",
    label: "時間",
    type: "number",
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
    field: "minutes",
    width: "50px",
  },
  {
    key: "goals",
    label: "G",
    type: "number",
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
    field: "goals",
    width: "50px",
  },
  {
    key: "assists",
    label: "A",
    type: "number",
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
    field: "assists",
    width: "50px",
  },
];

const StatisticsPanel = ({ summary }: { summary: UsePlayerSummary }) => {
  const {
    panels: {
      statistics: { text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        fieldDefinitions={fieldDefinitions}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
        ]}
      />
    </>
  );
};

export default StatisticsPanel;
