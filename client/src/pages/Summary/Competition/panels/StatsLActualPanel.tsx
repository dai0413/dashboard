import { isFilterable, isSortable } from "../../../../types/field";
import { UseCompetitionSummary } from "../types";
import { DataViewContainer } from "../../../../components/dataView";
import { statsFields } from "../constants/field";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { ViewMode } from "../../../../types/types";

const StatsLActualPanel = ({ summary }: { summary: UseCompetitionSummary }) => {
  const {
    panels: {
      statsL: { text, items, isLoading, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <DataViewContainer
        totalCount={items.actual.length}
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
        viewModes={[ViewMode.TABLE, ViewMode.TILE]}
        viewData={{
          [ViewMode.TABLE]: items.actual,
          [ViewMode.TILE]: items.actual,
        }}
      />
    </>
  );
};

export default StatsLActualPanel;
