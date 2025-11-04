import { TableWithFetch } from "../components/table";
import { ModelType } from "../types/models";
import { API_ROUTES } from "../lib/apiRoutes";

const NoCallUp = () => {
  const japan = import.meta.env.VITE_JPN_COUNTRY_ID;

  return (
    <div className="p-6">
      <TableWithFetch
        title="登録メンバーなし"
        fetch={{
          apiRoute: API_ROUTES.AGGREGATE.NO_CALLUP,
          path: japan,
        }}
        modelType={ModelType.NATIONAL_MATCH_SERIES}
        headers={[
          { label: "名称", field: "name", width: "250px" },
          { label: "国名", field: "country", width: "100px" },
          { label: "年代", field: "age_group", width: "100px" },
          { label: "招集日", field: "joined_at" },
        ]}
      />
    </div>
  );
};

export default NoCallUp;
