import { useEffect, useState } from "react";
import { CustomTableContainer } from "../components/table";
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
import { QueryParams, ResBody } from "../lib/api/readItems";

const NoCallUp = () => {
  const api = useApi();

  const handlePageChange = async (page: number) => {
    setPage(page);
    readNoCallup({ page: page });
  };

  const [data, setData] = useState<NationalMatchSeriesGet[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [dataIsLoading, setDataIsLoading] = useState<boolean>(false);

  const readNoCallup = (params: QueryParams) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.AGGREGATE.NO_CALLUP,
      params,
      path: japan,
      onSuccess: (resBody: ResBody<NationalMatchSeries>) => {
        setData(convert(ModelType.NATIONAL_MATCH_SERIES, resBody.data));
        setTotalCount(resBody.totalCount);
        setPage(resBody.page);
      },
      handleLoading: (time) => setLoading(time, "data"),
    });

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

  useEffect(() => {
    readNoCallup({ page: page });
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
      <CustomTableContainer
        items={data}
        title="登録メンバーなし"
        headers={[
          { label: "名称", field: "name", width: "250px" },
          { label: "国名", field: "country", width: "100px" },
          { label: "年代", field: "age_group", width: "100px" },
          { label: "招集日", field: "joined_at" },
        ]}
        modelType={ModelType.NATIONAL_MATCH_SERIES}
        originalFilterField={inTransfersOptions.filterField}
        originalSortField={inTransfersOptions.sortField}
        itemsLoading={dataIsLoading}
        linkField={[
          {
            field: "name",
            to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
          },
        ]}
        pageNum={page}
        totalCount={totalCount}
        handlePageChange={handlePageChange}
        detailLinkValue={APP_ROUTES.NO_CALLUP}
      />
    </div>
  );
};

export default NoCallUp;
