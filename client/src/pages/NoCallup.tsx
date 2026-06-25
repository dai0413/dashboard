import { TableWithFetch } from "../components/table";
import { ModelType } from "../types/models";
import { APP_ROUTES } from "../lib/appRoutes";
import { API_PATHS } from "@dai0413/myorg-shared";
import { ColumnType } from "../types/table";

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
            label: "国名",
            field: "country",
            width: "100px",
            getValueType: ColumnType.FIELD,
            key: "country",
            displayOnTable: true,
            type: "string",
          },
          {
            label: "国名",
            field: "team",
            width: "100px",
            getValueType: ColumnType.FIELD,
            key: "team",
            displayOnTable: true,
            type: "string",
          },
          {
            label: "年代",
            field: "age_group",
            width: "100px",
            getValueType: ColumnType.FIELD,
            key: "age_group",
            displayOnTable: true,
            type: "select",
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
