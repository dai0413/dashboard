import { ModelType } from "../../../../types/models";
import { TableClient } from "../../../../components/dataView";
import {
  getFields,
  getFilterableFields,
  getSortableFields,
} from "../../../../lib/model-fields";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { UseCompetitionSummary } from "../types";
import { ViewMode } from "../../../../types/types";

const StatsLPanel = ({ summary }: { summary: UseCompetitionSummary }) => {
  const {
    id,
    panels: {
      statsL: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  if (!summary.select) return;

  const { selectedOption } = summary.select;

  return (
    <>
      <h2 className="text-base font-semibold text-gray-800">{text}</h2>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.STATS_L}
        fieldDefinitions={getFields(ModelType.STATS_L)}
        viewModes={[ViewMode.TABLE, ViewMode.TILE]}
        viewData={{
          [ViewMode.TABLE]: items.raw,
          [ViewMode.TILE]: items.raw,
        }}
        totalCount={items.raw.length}
        reloadFun={reloadFun}
        filterField={getFilterableFields(ModelType.STATS_L).filter(
          (file) => file.key !== "competition",
        )}
        sortField={getSortableFields(ModelType.STATS_L).filter(
          (file) => file.key !== "competition",
        )}
        initialData={{
          metaData: {
            season: selectedOption?._id,
            competition: id,
          },
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
