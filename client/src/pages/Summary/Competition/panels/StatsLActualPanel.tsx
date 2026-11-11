import { isFilterable, isSortable } from "../../../../utils/data-field";
import { StatsActual, UseCompetitionSummary } from "../types";
import { DataViewContainer } from "../../../../components/dataView";
import { statsFields } from "../constants/field";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { ViewMode } from "../../../../types/types";
import { TableHeader } from "../../../../types/table";

const filterHeaders = (visibleHeaders: TableHeader<StatsActual>[]) => {
  const headers = visibleHeaders.filter((header) => header.key !== "team");
  return headers;
};

const createLabel = (item: StatsActual): string => {
  return item.team.label;
};

const createColor = (item: StatsActual): string | undefined => {
  return item.teamColor;
};

const StatsLActualPanel = ({ summary }: { summary: UseCompetitionSummary }) => {
  const {
    panels: {
      statsL: { text, items, isLoading, reloadFun },
    },
  } = summary;

  return (
    <>
      <h2 className="text-base font-semibold text-gray-800">{text}</h2>
      <DataViewContainer
        totalCount={items.values.length}
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
        viewModes={[ViewMode.TABLE, ViewMode.TILE, ViewMode.SCATTER]}
        viewData={{
          [ViewMode.TABLE]: items.values,
          [ViewMode.TILE]: items.values,
          [ViewMode.SCATTER]: {
            filterHeaders,
            createLabel,
            createColor,
          },
        }}
      />
    </>
  );
};

export default StatsLActualPanel;
