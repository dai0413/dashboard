import { TableWithFetch } from "../components/table";
import { ModelType } from "../types/models";
import { APP_ROUTES } from "../lib/appRoutes";
import { API_PATHS } from "@dai0413/myorg-shared";
import { ColumnType } from "../types/table";
import { fieldDefinition } from "../lib/model-fields";
import { isFilterable, isSortable } from "../types/field";

const NoCallUp = () => {
  const japan = import.meta.env.VITE_JPN_COUNTRY_ID;

  return (
    <div className="p-6">
      <TableWithFetch
        title="登録メンバーなし"
        fetch={{
          apiRoute: API_PATHS.AGGREGATE.NATIONAL_CALLUP.SERIES_COUNT(japan),
        }}
        modelType={ModelType.NATIONAL_MATCH_SERIES}
        filterField={fieldDefinition[ModelType.NATIONAL_MATCH_SERIES]?.filter(
          isFilterable,
        )}
        sortField={fieldDefinition[ModelType.NATIONAL_MATCH_SERIES]?.filter(
          isSortable,
        )}
        fieldDefinitions={[
          {
            label: "名称",
            field: "name",
            width: "250px",
            getValueType: ColumnType.FIELD,
            key: "name",
            displayOnTable: true,
            type: "string",
          },
          {
            key: "team",
            width: "100px",
            field: "team",
            filterKey: "team",
            label: "チーム",
            type: "string",
            filterable: true,
            sortable: true,
            displayOnDetail: true,
            displayOnTable: true,
            getValueType: ColumnType.FIELD,
          },
          {
            label: "招集日",
            field: "joined_at",
            getValueType: ColumnType.FIELD,
            key: "joined_at",
            displayOnTable: true,
            type: "Date",
          },
        ]}
        linkField={[
          {
            field: "name",
            to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default NoCallUp;
