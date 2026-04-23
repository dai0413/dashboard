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
        headers={[
          {
            label: "名称",
            field: "name",
            width: "250px",
            type: ColumnType.FIELD,
            id: "name",
            defaultDisplay: true,
          },
          {
            label: "国名",
            field: "country",
            width: "100px",
            type: ColumnType.FIELD,
            id: "country",
            defaultDisplay: true,
          },
          {
            label: "年代",
            field: "age_group",
            width: "100px",
            type: ColumnType.FIELD,
            id: "age_group",
            defaultDisplay: true,
          },
          {
            label: "招集日",
            field: "joined_at",
            type: ColumnType.FIELD,
            id: "joined_at",
            defaultDisplay: true,
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
