import { useState } from "react";
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
import {
  FilterableFieldDefinition,
  QueryParams,
  ResBody,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { Data } from "../../types/types";
import { normalizeFiltersForApi } from "../../utils/normalizeFiltersForApi";

type TableWithFetchProps<T extends ModelType> = Omit<
  TableBase<T>,
  "modelType"
> &
  TableFetch &
  TableOperationFields & {
    modelType: T;
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
}: TableWithFetchProps<T>) => {
  const api = useApi();

  const [data, setData] = useState<Data<GettedModelDataMap[T]>>({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const fetchData = (
    filterConditions?: FilterableFieldDefinition[],
    sortConditions?: SortableFieldDefinition[],
    params?: QueryParams
  ) => {
    const readParams: Record<string, any> = {
      ...params,
    };

    if (filterConditions && filterConditions.length > 0) {
      readParams.filters = JSON.stringify(
        normalizeFiltersForApi(filterConditions)
      );
    }

    if (sortConditions && sortConditions.length > 0) {
      readParams.sorts = JSON.stringify(sortConditions);
    }

    readItemsBase({
      apiInstance: api,
      backendRoute: apiRoute,
      params: readParams,
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

  const handlePageChange = async (
    page: number,
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[]
  ) => fetchData(filterConditions, sortConditions, { ...params, page: page });

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
      reloadFun={async (filterConditions, sortConditions) =>
        fetchData(filterConditions, sortConditions, params)
      }
      detailLinkValue={detailLinkValue}
      formInitialData={formInitialData}
    />
  );
};

export default TableWithFetch;
