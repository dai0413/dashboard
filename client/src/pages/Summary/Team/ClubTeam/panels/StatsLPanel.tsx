import { ModelType } from "../../../../../types/models";
import { TableClient } from "../../../../../components/dataView";
import {
  getFilterableFields,
  getSortableFields,
  getDataFields,
} from "../../../../../utils/data-field";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { UseClubTeamSummary } from "../types";
import { ViewMode } from "../../../../../types/types";

const StatsLPanel = ({ summary }: { summary: UseClubTeamSummary }) => {
  const {
    id,
    panels: {
      statsL: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <h2 className="text-base font-semibold text-gray-800">{text}</h2>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.STATS_L}
        fieldDefinitions={getDataFields(ModelType.STATS_L)}
        viewModes={[ViewMode.TABLE, ViewMode.TILE]}
        viewData={{ [ViewMode.TABLE]: items, [ViewMode.TILE]: items }}
        totalCount={items.length}
        reloadFun={reloadFun}
        filterField={getFilterableFields(ModelType.STATS_L).filter(
          (file) => file.key !== "team",
        )}
        sortField={getSortableFields(ModelType.STATS_L).filter(
          (file) => file.key !== "team",
        )}
        initialData={{
          formData: { team: id },
        }}
        linkField={[
          {
            field: "match",
            to: APP_ROUTES.MATCH_SUMMARY,
          },
        ]}
      />
    </>
  );
};

export default StatsLPanel;
