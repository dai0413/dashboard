import { ModelType } from "../../../../types/models";
import { TableClient } from "../../../../components/dataView";
import { isFilterable, isSortable } from "../../../../types/field";
import { UseMatchSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { statsLFieldDefinition } from "../constants/field";
import { ViewMode } from "../../../../types/types";

const AwayStatsLPanel = ({ summary }: { summary: UseMatchSummary }) => {
  const {
    id,
    selected,
    panels: {
      awayStatsL: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  if (!selected) return;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.STATS_L}
        fieldDefinitions={statsLFieldDefinition}
        viewModes={[ViewMode.TABLE, ViewMode.TILE]}
        viewData={{
          [ViewMode.TABLE]: items,
          [ViewMode.TILE]: items,
        }}
        totalCount={items.length}
        reloadFun={reloadFun}
        filterField={statsLFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "match" && file.key !== "team")}
        sortField={statsLFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "match" && file.key !== "team")}
        linkField={[
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
        initialData={{
          formData: {
            match: id,
          },
          metaData: {
            match: [id],
            urls: selected.urls,
            competition_stage: selected.competition_stage.id,
          },
        }}
      />
    </>
  );
};

export default AwayStatsLPanel;
