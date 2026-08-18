import { ModelType } from "../../../../../types/models";
import TableClient from "../../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../../types/field";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { UseNationalTeamSummary } from "../types";
import { NationalMatchSeriesGet } from "../../../../../types/models/national-match-series";

const nationalMatchSeriesFieldDefinition =
  convertFieldDefinition<NationalMatchSeriesGet>(
    ["name", "joined_at", "left_at"],
    fieldDefinition[ModelType.NATIONAL_MATCH_SERIES],
  );

const SereisPanel = ({ summary }: { summary: UseNationalTeamSummary }) => {
  const {
    id,
    panels: {
      series: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.NATIONAL_MATCH_SERIES}
        fieldDefinitions={nationalMatchSeriesFieldDefinition}
        pageNum={1}
        items={items}
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
