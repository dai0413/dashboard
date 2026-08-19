import TableClient from "../../../../components/table/TableClient";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { UsePlayerSummary } from "../types";
import { playerStatistics } from "../../../../lib/fields/playerStatistics";
import { UIFieldDefinition } from "../../../../types/field";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";

const secondKeys = playerStatistics
  .map((ps) => ps.key)
  .filter(
    (d) =>
      d !== "player" &&
      d !== "group.season" &&
      d !== "group.season.competition",
  );

const fieldDefinitions: UIFieldDefinition<PlayerStatistic>[] = [
  ...convertFieldDefinition(
    ["group.season", "group.season.competition", ...secondKeys],
    playerStatistics,
  ).filter((k) => k.key !== "player"),
];

const StatisticsPanel = ({ summary }: { summary: UsePlayerSummary }) => {
  const {
    panels: {
      statistics: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        fieldDefinitions={fieldDefinitions}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
          {
            field: "group.season.competition",
            to: APP_ROUTES.COMPETITION_SUMMARY,
          },
          {
            field: "teams",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
      />
    </>
  );
};

export default StatisticsPanel;
