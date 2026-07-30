import { isFilterable, isSortable } from "../../../../types/field";
import { UseCompetitionSummary } from "../types";
import { CustomTableContainer } from "../../../../components/table";
import { statsFields } from "../constants/field";
import { APP_ROUTES } from "../../../../lib/appRoutes";

const StatsLDeviationPanel = ({
  summary,
}: {
  summary: UseCompetitionSummary;
}) => {
  const {
    panels: {
      statsL: { text, items, isLoading, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <CustomTableContainer
        pageNum={1}
        items={items.deviation}
        newItemsPerPage={20}
        itemsLoading={isLoading}
        fieldDefinitions={statsFields}
        filterField={statsFields.filter(isFilterable)}
        sortField={statsFields?.filter(isSortable)}
        linkField={[
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
        reloadFun={reloadFun}
      />
    </>
  );
};

export default StatsLDeviationPanel;
