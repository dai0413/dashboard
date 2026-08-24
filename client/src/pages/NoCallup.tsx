import { ModelType } from "../types/models";
import { APP_ROUTES } from "../lib/appRoutes";
import { API_PATHS } from "@dai0413/myorg-shared";
import { fieldDefinition } from "../lib/model-fields";
import { isFilterable, isSortable, UIFieldDefinition } from "../types/field";
import TableClient from "../components/table/TableClient";
import { useEffect, useState } from "react";
import { Data } from "../types/types";
import { readItemsBase } from "../lib/api";
import { api } from "../context/api-context";
import { convert } from "../lib/convert/DBtoGetted";
import {
  NationalMatchSeries,
  NationalMatchSeriesGet,
} from "../types/models/national-match-series";
const japan = import.meta.env.VITE_JPN_COUNTRY_ID;

const fields: UIFieldDefinition<NationalMatchSeriesGet>[] =
  fieldDefinition[ModelType.NATIONAL_MATCH_SERIES] || [];

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
        fieldDefinitions={fields}
        itemsLoading={items.isLoading}
        reloadFun={reloadFun}
        pageNum={1}
        items={items.data}
        filterField={fields?.filter(isFilterable)}
        sortField={fields?.filter(isSortable)}
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
