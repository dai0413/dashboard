import { useEffect, useMemo } from "react";

import ListView from "./ListView";
import TableToolbar from "./TableToolbar";
import { Sort, Filter } from "../modals/index";

import { FormTypeMap, ModelType } from "../../types/models";

import { useSort } from "../../context/sort-context";
import { ModelRouteMap } from "../../types/models";
import { ModelContext } from "../../types/context";
import { useFilter } from "../../context/filter-context";
import { useQuery } from "../../context/query-context";
import { TableBase } from "../../types/table";
import { normalizeFiltersForApi } from "../../utils/normalizeFiltersForApi";
import { useListView } from "../../context/listView-context";

type ModelBase<K extends keyof FormTypeMap> = Omit<
  TableBase<K>,
  "modelType"
> & {
  modelType: ModelType;
  contextState: ModelContext<K>;
};

type TableContainerProps<K extends keyof FormTypeMap> = ModelBase<K>;

const ModelTableContainer = <K extends keyof FormTypeMap>(
  props: TableContainerProps<K>
) => {
  const { closeSort, sortConditions } = useSort();
  const { closeFilter, filterConditions } = useFilter();
  const { setPage } = useQuery();
  const { updateTrigger } = useListView();

  const {
    items,
    isLoading,
    filterableField,
    sortableField,
    page,
    totalCount,
    readItems,
    uploadFile,
    downloadFile,
  } = props.contextState.metacrud;

  useEffect(() => {
    readItems({
      page: 1,
      filters: JSON.stringify(normalizeFiltersForApi(filterConditions)),
      sorts: JSON.stringify(sortConditions),
    });
    setPage("page", 1);
  }, [updateTrigger]);

  const tableIsLoading = useMemo(() => isLoading, [isLoading]);
  const filterField = useMemo(() => filterableField, [filterableField]);
  const sortField = useMemo(() => sortableField, [sortableField]);

  const handleApplyFilter = () => {
    readItems({
      page: 1,
      filters: JSON.stringify(normalizeFiltersForApi(filterConditions)),
      sorts: JSON.stringify(sortConditions),
    });
    setPage("page", 1);

    closeFilter();
    closeSort();
  };

  const detailLink = ModelRouteMap[props.modelType];

  const onPageChange = async (page: number) => {
    readItems({
      page: page,
      filters: JSON.stringify(normalizeFiltersForApi(filterConditions)),
      sorts: JSON.stringify(sortConditions),
    });
    setPage("page", page);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg max-w-7xl w-full mx-auto p-3">
      {props.title && (
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {props.title}
        </h2>
      )}

      <Filter filterableField={filterField} onApply={handleApplyFilter} />
      <Sort sortableField={sortField} onApply={handleApplyFilter} />
      <TableToolbar
        modelType={props.modelType}
        uploadFile={uploadFile}
        downloadFile={downloadFile}
        formInitialData={props.formInitialData}
      />
      <ListView
        data={items}
        totalCount={totalCount}
        headers={props.headers}
        pageNation="server"
        linkField={props.linkField}
        detailLink={detailLink}
        itemsPerPage={10}
        isLoading={tableIsLoading}
        currentPage={page}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ModelTableContainer;
