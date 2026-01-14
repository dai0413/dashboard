import { useMemo } from "react";

import ListView from "./ListView";
import TableToolbar from "./TableToolbar";
import { Sort, Filter } from "../modals/index";

import { FormTypeMap, ModelType } from "../../types/models";

import { SortProvider, useSort } from "../../context/sort-context";
import { ModelRouteMap } from "../../types/models";
import { ModelContext } from "../../types/context";
import { FilterProvider, useFilter } from "../../context/filter-context";
import { useQuery } from "../../context/query-context";
import { TableBase } from "../../types/table";
import { normalizeFiltersForApi } from "../../utils/normalizeFiltersForApi";
import { ListViewProvider, useListView } from "../../context/listView-context";
import { useAlert } from "../../context/alert-context";
import { Loader2 } from "lucide-react";

type ModelBase<K extends keyof FormTypeMap> = Omit<
  TableBase<K>,
  "modelType"
> & {
  modelType: ModelType;
  contextState: ModelContext<K>;
};

type TableContainerProps<K extends keyof FormTypeMap> = ModelBase<K>;

const TableContainer = <K extends keyof FormTypeMap>(
  props: TableContainerProps<K>
) => {
  const { closeSort, sortConditions } = useSort();
  const { closeFilter, filterConditions } = useFilter();
  const { setPage } = useQuery();
  const { itemsPerPage } = useListView();
  const {
    main: { handleSetAlert },
  } = useAlert();

  // useEffect(
  //   () =>
  //     console.log(
  //       "filterConditions",
  //       props.contextState.metacrud.items,
  //       filterConditions
  //     ),
  //   [filterConditions]
  // );

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

  const tableIsLoading = useMemo(() => isLoading, [isLoading]);
  const filterField = useMemo(() => filterableField, [filterableField]);
  const sortField = useMemo(() => sortableField, [sortableField]);

  const handleApplyFilter = () => {
    if (filterConditions.length === 0) {
      handleSetAlert({
        success: false,
        message: "条件を設定してください",
      });
    } else {
      handleSetAlert({ success: true, message: "" });
      readItems({
        page: 1,
        filters: JSON.stringify(normalizeFiltersForApi(filterConditions)),
        sorts: JSON.stringify(sortConditions),
      });
    }

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
      {tableIsLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="bg-gray-50 px-8 py-10 text-center">
            <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
          </div>
        </div>
      ) : items && items?.length > 0 && props.headers ? (
        <ListView
          data={items}
          totalCount={totalCount}
          headers={props.headers}
          pageNation="server"
          linkField={props.linkField}
          detailLink={detailLink}
          itemsPerPage={itemsPerPage || 10}
          isLoading={tableIsLoading}
          currentPage={page}
          onPageChange={onPageChange}
        />
      ) : (
        <div className="flex items-center justify-center py-16">
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-8 py-10 text-center">
            <p className="mb-2 text-lg font-semibold text-gray-600">
              表示するデータがありません
            </p>
            {filterConditions.length === 0 && (
              <p className="text-sm text-gray-400">
                フィルターから条件を追加してください
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ModelTableContainer = <K extends keyof FormTypeMap>(
  props: TableContainerProps<K>
) => {
  return (
    <FilterProvider>
      <SortProvider>
        <ListViewProvider>
          <TableContainer {...props} />
        </ListViewProvider>
      </SortProvider>
    </FilterProvider>
  );
};

export default ModelTableContainer;
