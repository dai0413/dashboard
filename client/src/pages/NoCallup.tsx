import { TableWithFetch } from "../components/table";
import { ModelType } from "../types/models";
import { APP_ROUTES } from "../lib/appRoutes";
import { API_PATHS } from "../lib/api-paths";

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
          { label: "名称", field: "name", width: "250px" },
          { label: "国名", field: "country", width: "100px" },
          { label: "年代", field: "age_group", width: "100px" },
          { label: "招集日", field: "joined_at" },
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
