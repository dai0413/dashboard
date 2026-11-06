import { ModelType } from "../../../../../types/models";
import { TableClient } from "../../../../../components/dataView";
import { convertFieldDefinition } from "../../../../../utils/displayField/convertFieldDefinition";
import { isFilterable, isSortable } from "../../../../../types/field";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { UseNationalTeamSummary } from "../types";
import { ViewMode } from "../../../../../types/types";

const nationalMatchSeriesFieldDefinition = convertFieldDefinition({
  keys: ["name", "joined_at", "left_at"],
  getFieldsKey: ModelType.NATIONAL_MATCH_SERIES,
});

const SereisPanel = ({ summary }: { summary: UseNationalTeamSummary }) => {
  const {
    id,
    panels: {
      series: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <h2 className="text-base font-semibold text-gray-800">{text}</h2>
      <TableClient
        key={`${key}-monthly`}
        itemsLoading={isLoading}
        modelType={ModelType.NATIONAL_MATCH_SERIES}
        defaultViewMode={ViewMode.MONTHLY_CALENDAR}
        viewModes={[ViewMode.MONTHLY_CALENDAR]}
        viewData={{
          [ViewMode.MONTHLY_CALENDAR]: items.monthlyCalendar,
        }}
        totalCount={items.series.length}
        noToolBar={false}
      />
      <TableClient
        key={`${key}-table`}
        itemsLoading={isLoading}
        modelType={ModelType.NATIONAL_MATCH_SERIES}
        fieldDefinitions={nationalMatchSeriesFieldDefinition}
        viewModes={[ViewMode.TABLE, ViewMode.TILE]}
        viewData={{
          [ViewMode.TABLE]: items.series,
          [ViewMode.TILE]: items.series,
        }}
        totalCount={items.series.length}
        reloadFun={reloadFun}
        filterField={nationalMatchSeriesFieldDefinition?.filter(isFilterable)}
        sortField={nationalMatchSeriesFieldDefinition?.filter(isSortable)}
        linkField={[
          {
            field: "name",
            to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
          },
        ]}
        initialData={{
          formData: {
            team: id,
          },
        }}
      />
    </>
  );
};

export default SereisPanel;
