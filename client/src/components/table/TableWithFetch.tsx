import { useEffect, useState } from "react";
import { CustomTableContainer } from "../../components/table";
import {
  GettedModelDataMap,
  ModelDataMap,
  ModelType,
} from "../../types/models";
import { useApi } from "../../context/api-context";
import { readItemsBase } from "../../lib/api";
import { convert } from "../../lib/convert/DBtoGetted";
import { TableBase, TableFetch, TableOperationFields } from "../../types/table";
import { useFilter } from "../../context/filter-context";
import { useSort } from "../../context/sort-context";
import { QueryParams, ResBody } from "@dai0413/myorg-shared";
import { Data } from "../../types/types";
import { normalizeFiltersForApi } from "../../utils/normalizeFiltersForApi";

type TableWithFetchProps<T extends ModelType> = Omit<
  TableBase<T>,
  "modelType"
> &
  TableFetch &
  TableOperationFields & {
    modelType: T;
    reloadTrigger?: number;
  };

const TableWithFetch = <T extends ModelType>({
  title,
  modelType,
  headers,
  fetch: { apiRoute, params },
  filterField = [],
  sortField = [],
  linkField = [],
  detailLinkValue,
  formInitialData,
  reloadTrigger,
}: TableWithFetchProps<T>) => {
  const api = useApi();
  const { filterConditions } = useFilter();
  const { sortConditions } = useSort();

  const [data, setData] = useState<Data<GettedModelDataMap[T]>>({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const fetchData = (params?: QueryParams) => {
    readItemsBase({
      apiInstance: api,
      backendRoute: apiRoute,
      params: {
        ...params,
        filters: JSON.stringify(normalizeFiltersForApi(filterConditions)),
        sorts: JSON.stringify(sortConditions),
      },
      onSuccess: (resBody: ResBody<ModelDataMap[T][]>) =>
        setData({
          data: convert(modelType, resBody.data),
          totalCount: resBody.totalCount ? resBody.totalCount : 1,
          page: resBody.page ? resBody.page : 1,
          isLoading: false,
        }),
      handleLoading: (time) => {
        setData((prev) => ({ ...prev, isLoading: time === "start" }));
      },
    });
  };

  useEffect(() => {
    fetchData(params);
  }, [apiRoute, JSON.stringify(params), reloadTrigger]);

  const handlePageChange = async (page: number) =>
    fetchData({ ...params, page: page });

  return (
    <CustomTableContainer
      modelType={modelType}
      items={data.data}
      title={title}
      headers={headers}
      filterField={filterField}
      sortField={sortField}
      itemsLoading={data.isLoading}
      linkField={linkField}
      pageNum={data.page}
      totalCount={data.totalCount}
      handlePageChange={handlePageChange}
      reloadFun={async () => fetchData(params)}
      detailLinkValue={detailLinkValue}
      formInitialData={formInitialData}
    />
  );
};

export default TableWithFetch;
