import TableClient from "../../../../components/table/TableClient";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { UsePlayerSummary } from "../types";
import { playerStatistics as fieldDefinitions } from "../../../../lib/fields/playerStatistics";

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
        ]}
      />
    </>
  );
};

export default StatisticsPanel;
