import { useState } from "react";
import { CustomTableContainer } from "../../components/table";
import {
  FormTypeMap,
  GettedModelDataMap,
  ModelDataMap,
} from "../../types/models";
import { api } from "../../context/api-context";
import { readItemsBase } from "../../lib/api";
import { convert } from "../../lib/convert/DBtoGetted";
import { TableOperationFields } from "../../types/table";
import {
  FilterableFieldDefinition,
  QueryParams,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { Data } from "../../types/types";
import { normalizeFiltersForApi } from "../../utils/filter/normalizeFiltersForApi";
import { TableFetch } from "../../types/table";

type TableWithFetchProps<K extends keyof GettedModelDataMap> = Omit<
  TableFetch<GettedModelDataMap[K], FormTypeMap[K]>,
  "modelType"
> &
  TableOperationFields & {
    modelType: K;
  };

const TableWithFetch = <K extends keyof GettedModelDataMap>({
  pageNation,
  title,
  modelType,
  fieldDefinitions,
  fetch: { apiRoute, params },
  filterField = [],
  sortField = [],
  linkField = [],
  detailLinkValue,
  initialData,
}: TableWithFetchProps<K>) => {
  const [data, setData] = useState<Data<GettedModelDataMap[K]>>({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const fetchData = async (
    filterConditions?: FilterableFieldDefinition[],
    sortConditions?: SortableFieldDefinition[],
    params?: QueryParams,
  ) => {
    const readParams: Record<string, any> = {
      ...params,
    };

    if (filterConditions && filterConditions.length > 0) {
      readParams.filters = JSON.stringify(
        normalizeFiltersForApi(filterConditions),
      );
    }

    if (sortConditions && sortConditions.length > 0) {
      readParams.sorts = JSON.stringify(sortConditions);
    }

    const obj = await readItemsBase<ModelDataMap[K][]>({
      apiInstance: api,
      backendRoute: apiRoute,
      params: readParams,
      handleLoading: (time) => {
        setData((prev) => ({ ...prev, isLoading: time === "start" }));
      },
    });

    if (obj) {
      setData({
        data: convert(modelType, obj.data),
        totalCount: obj.totalCount ? obj.totalCount : 1,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  const handlePageChange = async (
    page: number,
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[],
  ) => fetchData(filterConditions, sortConditions, { ...params, page: page });

  return (
    <CustomTableContainer
      pageNation={
        pageNation
          ? pageNation
          : params && "getAll" in params
            ? "client"
            : "server"
      }
      modelType={modelType}
      items={data.data}
      title={title}
      fieldDefinitions={fieldDefinitions}
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
      initialData={initialData}
    />
  );
};

export default TableWithFetch;
