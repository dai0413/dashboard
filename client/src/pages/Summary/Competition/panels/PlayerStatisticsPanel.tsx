import TableClient from "../../../../components/table/TableClient";
import {
  isFilterable,
  isSortable,
  UIFieldDefinition,
} from "../../../../types/field";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { playerStatistics } from "../../../../lib/fields/playerStatistics";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { ColumnType } from "../../../../types/table";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { UseCompetitionSummary } from "../types";

const keys = playerStatistics.map((ps) => ps.key);
const secondKeys = keys.filter((d) => d !== "player" && d !== "mainPosition");

const fieldDefinitions: UIFieldDefinition<PlayerStatistic>[] = [
  ...convertFieldDefinition(
    ["mainPosition", "player"],
    playerStatistics,
  ).filter((k) => k.key === "mainPosition" || k.key === "player"),
  {
    key: "dob",
    filterKey: "player.name",
    label: "生年月日",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.CUSTOM,
    getData: (d) => toDateKey(d.player.dob) || "",
    width: "80px",
  },
  ...convertFieldDefinition(secondKeys, playerStatistics).filter(
    (d) => d.key !== "mainPosition" && d.key !== "player",
  ),
];

const PlayerStatisticsPanel = ({
  summary,
}: {
  summary: UseCompetitionSummary;
}) => {
  const {
    id,
    panels: {
      playerStatistics: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        fieldDefinitions={fieldDefinitions}
        itemsLoading={isLoading}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={fieldDefinitions?.filter(isFilterable)}
        sortField={fieldDefinitions?.filter(isSortable)}
        initialData={{ formData: { team: id } }}
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

export default PlayerStatisticsPanel;
