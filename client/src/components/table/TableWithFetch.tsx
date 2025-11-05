import { useEffect, useState } from "react";
import { CustomTableContainer } from "../../components/table";
import {
  GettedModelDataMap,
  ModelDataMap,
  ModelType,
} from "../../types/models";
import { useApi } from "../../context/api-context";
import { readItemsBase } from "../../lib/api";
import { CrudRouteWithParams } from "../../lib/apiRoutes";
import { convert } from "../../lib/convert/DBtoGetted";
import { QueryParams, ResBody } from "../../lib/api/readItems";
import { Data } from "../../types/types";
import { TableBase, TableFetch, TableOperationFields } from "../../types/table";

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
  fetch: { apiRoute, path, params },
  filterField = [],
  sortField = [],
  linkField = [],
  detailLinkValue,
  formInitialData,
  reloadTrigger,
}: TableWithFetchProps<T>) => {
  const api = useApi();

  const [data, setData] = useState<Data<GettedModelDataMap[T]>>({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const fetchData = (
    params?: QueryParams,
    path?: CrudRouteWithParams<any>["path"]
  ) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: apiRoute,
      params,
      path,
      onSuccess: (resBody: ResBody<ModelDataMap[T]>) =>
        setData({
          data: convert(modelType, resBody.data),
          totalCount: resBody.totalCount,
          page: resBody.page,
          isLoading: false,
        }),
      handleLoading: (time) => {
        setData((prev) => ({ ...prev, isLoading: time === "start" }));
      },
    });

  useEffect(() => {
    fetchData(params, path);
  }, [apiRoute, JSON.stringify(params), path, reloadTrigger]);

  const handlePageChange = (page: number) =>
    fetchData({ ...params, page: page }, path);

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
      reloadFun={() => fetchData(params, path)}
      detailLinkValue={detailLinkValue}
      formInitialData={formInitialData}
    />
  );
};

export default TableWithFetch;
