import { useEffect, useState } from "react";
import { TableContainer } from "../components/table";
import { ModelType } from "../types/models";
import { useApi } from "../context/api-context";
import {
  NationalMatchSeries,
  NationalMatchSeriesGet,
} from "../types/models/national-match-series";
import { readItemsBase } from "../lib/api";
import { API_ROUTES } from "../lib/apiRoutes";
import { convert } from "../lib/convert/DBtoGetted";
import { fieldDefinition } from "../lib/model-fields";
import {
  FilterableFieldDefinition,
  isFilterable,
  isSortable,
  SortableFieldDefinition,
} from "../types/field";
import { APP_ROUTES } from "../lib/appRoutes";

const NoCallUp = () => {
  const api = useApi();

  const [data, setData] = useState<NationalMatchSeriesGet[]>([]);
  const [dataIsLoading, setDataIsLoading] = useState<boolean>(false);

  const isLoadingSetters = {
    data: setDataIsLoading,
  };

  const setLoading = (
    time: "start" | "end",
    data: keyof typeof isLoadingSetters
  ) => {
    isLoadingSetters[data](time === "start");
  };

  const japan = import.meta.env.VITE_JPN_COUNTRY_ID;

  const readCurrentPlayers = (_id: string) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.AGGREGATE.NO_CALLUP(japan),
      params: { endDate: String(new Date()) },
      onSuccess: (items: NationalMatchSeries[]) => {
        setData(convert(ModelType.NATIONAL_MATCH_SERIES, items));
      },
      handleLoading: (time) => setLoading(time, "data"),
    });

  useEffect(() => {
    readCurrentPlayers(japan);
  }, []);

  const inTransfersOptions = {
    filterField: ModelType.NATIONAL_MATCH_SERIES
      ? (fieldDefinition[ModelType.NATIONAL_MATCH_SERIES]
          .filter(isFilterable)
          .filter(
            (file) => file.key !== "number"
          ) as FilterableFieldDefinition[])
      : [],
    sortField: ModelType.NATIONAL_MATCH_SERIES
      ? (fieldDefinition[ModelType.NATIONAL_MATCH_SERIES]
          .filter(isSortable)
          .filter((file) => file.key !== "number") as SortableFieldDefinition[])
      : [],
  };

  return (
    <div className="p-6">
      <TableContainer
        items={data}
        title="登録メンバーなし"
        headers={[
          { label: "名称", field: "name" },
          { label: "国名", field: "country" },
          { label: "年代", field: "team_class" },
          { label: "招集日", field: "joined_at" },
          { label: "解散日", field: "left_at" },
        ]}
        modelType={ModelType.NATIONAL_MATCH_SERIES}
        originalFilterField={inTransfersOptions.filterField}
        originalSortField={inTransfersOptions.sortField}
        formInitialData={{}}
        itemsLoading={dataIsLoading}
        summaryLinkField={{
          field: "name",
          to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
        }}
      />
    </div>
  );
};

export default NoCallUp;
