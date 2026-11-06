import { TableClient } from "../../../../components/dataView";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { isFilterable, isSortable } from "../../../../utils/data-field";
import { ModelType } from "../../../../types/models";
import { ViewMode } from "../../../../types/types";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { UseNationalSummary } from "../types";

const nationalMatchSeriesFieldDefinition = convertFieldDefinition({
  keys: ["name", "team", "joined_at", "left_at"],
  getFieldsKey: ModelType.NATIONAL_MATCH_SERIES,
});

const SereisPanel = ({ summary }: { summary: UseNationalSummary }) => {
  const {
    id,
    panels: {
      nationalMatchSeries: { isLoading, text, key, items, reloadFun },
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
        totalCount={items.data.length}
        noToolBar={false}
      />
      <TableClient
        key={`${key}-table`}
        itemsLoading={isLoading}
        modelType={ModelType.NATIONAL_MATCH_SERIES}
        fieldDefinitions={nationalMatchSeriesFieldDefinition}
        viewModes={[ViewMode.TABLE, ViewMode.TILE]}
        viewData={{
          [ViewMode.TABLE]: items.data,
          [ViewMode.TILE]: items.data,
        }}
        totalCount={items.data.length}
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
