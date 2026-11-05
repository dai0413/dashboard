import { ModelType } from "../types/models";
import { APP_ROUTES } from "../lib/appRoutes";
import { API_PATHS } from "@dai0413/myorg-shared";
import {
  getFields,
  getFilterableFields,
  getSortableFields,
} from "../lib/model-fields";
import { TableClient } from "../components/dataView";
import { useEffect, useState } from "react";
import { Data, ViewMode } from "../types/types";
import { readItemsBase } from "../lib/api";
import { api } from "../context/api-context";
import { convert } from "../lib/convert/DBtoGetted";
import {
  NationalMatchSeries,
  NationalMatchSeriesGet,
} from "../types/models/national-match-series";
const japan = import.meta.env.VITE_JPN_COUNTRY_ID;

const NoCallUp = () => {
  const [items, setItems] = useState<Data<NationalMatchSeriesGet>>({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const reloadFun = async () => {
    const obj = await readItemsBase<NationalMatchSeries[]>({
      apiInstance: api,
      backendRoute: API_PATHS.AGGREGATE.NATIONAL_CALLUP.SERIES_COUNT(japan),
      params: { getAll: true },
      handleLoading: (time) => {
        setItems((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (obj) {
      let processed = convert(ModelType.NATIONAL_MATCH_SERIES, obj.data);

      setItems({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    reloadFun();
  }, []);

  return (
    <div className="p-6">
      <TableClient
        modelType={ModelType.NATIONAL_MATCH_SERIES}
        title="登録メンバーなし"
        fieldDefinitions={getFields(ModelType.NATIONAL_MATCH_SERIES)}
        itemsLoading={items.isLoading}
        reloadFun={reloadFun}
        viewModes={[ViewMode.TABLE]}
        viewData={{
          [ViewMode.TABLE]: items.data,
          [ViewMode.TILE]: items.data,
        }}
        totalCount={items.data.length}
        filterField={getFilterableFields(ModelType.NATIONAL_MATCH_SERIES)}
        sortField={getSortableFields(ModelType.NATIONAL_MATCH_SERIES)}
        linkField={[
          {
            field: "name",
            to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
          },
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default NoCallUp;
