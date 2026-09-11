import { useEffect, useMemo } from "react";

import ListView from "./ListView";
import TableToolbar from "./TableToolbar";
import { Sort, Filter } from "../modals/index";

import { FormTypeMap, GettedModelDataMap } from "../../types/models";

import { SortProvider, useSort } from "../../context/sort-context";
import { ModelContext } from "../../types/context";
import { FilterProvider, useFilter } from "../../context/filter-context";
import { useQuery } from "../../context/query-context";
import { normalizeFiltersForApi } from "../../utils/filter/normalizeFiltersForApi";
import { ListViewProvider, useListView } from "../../context/listView-context";
import { useAlert } from "../../context/alert-context";
import { Loader2 } from "lucide-react";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import {
  getFields,
  getFilterableFields,
  getSortableFields,
} from "../../lib/model-fields";
import { getLinkFields } from "../../lib/model-link-fields";
import { PageButtons } from "./PageButtons";
import { getPageNumbers } from "../../utils/data/getPageNumbers";

type TableContainer<K extends keyof GettedModelDataMap> = {
  title: string;
  modelType: K;
  contextState: ModelContext<K>;
};

const TableContainer = <K extends keyof GettedModelDataMap>({
  title,
  modelType,
  contextState,
}: TableContainer<K>) => {
  const { closeSort, sortConditions } = useSort();
  const { closeFilter, filterConditions } = useFilter();
  const { setPage } = useQuery();
  const { setColumnVisibility, setPageNum, pageNum, itemsPerPage } =
    useListView();
  const {
    main: { handleSetAlert },
  } = useAlert();

  const {
    items,
    isLoading,
    totalCount,
    readItems,
    uploadFile,
    downloadFile,
    resetItems,
  } = contextState.metacrud;

  useEffect(() => {
    resetItems();
  }, []);

  const headers = useMemo(() => getFields(modelType), [modelType]);
  const filterField = useMemo(
    () => getFilterableFields(modelType),
    [modelType],
  );
  const sortField = useMemo(() => getSortableFields(modelType), [modelType]);
  const linkField = useMemo(() => getLinkFields(modelType), [modelType]);

  useEffect(() => {
    const initialVisibility = getFields(modelType)?.reduce(
      (acc, h) => {
        acc[h.key] = h.displayOnTable ?? true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    initialVisibility && setColumnVisibility(initialVisibility);
  }, [modelType]);

  const readPage = async (
    page: number,
    filters = filterConditions,
    sorts = sortConditions,
  ) => {
    return readItems({
      page,
      filters: JSON.stringify(normalizeFiltersForApi(filters)),
      sorts: JSON.stringify(sorts),
    });
  };

  const handleApplyFilter = async (
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[],
  ) => {
    handleSetAlert({ success: true, message: "" });
    await readPage(1, filterConditions, sortConditions);

    setPage("page", 1);

    closeFilter();
    closeSort();
  };

  const onPageChange = async (page: number) => {
    await readPage(page);
  };

  const datas = useMemo(() => {
    return items.map((item, i) => {
      const offset = (pageNum - 1) * (itemsPerPage || 1);

      return {
        item,
        index: offset + i,
      };
    });
  }, [items, pageNum, itemsPerPage]);

  const pages = useMemo(() => {
    const totalPages =
      itemsPerPage && totalCount
        ? Math.max(Math.ceil(totalCount / itemsPerPage), 1)
        : itemsPerPage
          ? Math.ceil(datas.length / itemsPerPage)
          : 1;

    const pages = getPageNumbers(pageNum, totalPages);

    return pages;
  }, [itemsPerPage, totalCount, datas]);

  return (
    <div className="bg-white shadow-lg rounded-lg w-full mx-auto p-3">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>

      <Filter filterableField={filterField} onApply={handleApplyFilter} />
      <Sort sortableField={sortField} onApply={handleApplyFilter} />
      <TableToolbar<GettedModelDataMap[K], FormTypeMap[K]>
        modelType={modelType}
        uploadFile={uploadFile}
        downloadFile={downloadFile}
        quickFilterItems={[]}
        headers={headers}
        items={datas}
      />
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="bg-gray-50 px-8 py-10 text-center">
            <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
          </div>
        </div>
      ) : items && items?.length > 0 && headers ? (
        <>
          <ListView<GettedModelDataMap[K]>
            modelType={modelType}
            datas={datas}
            headers={headers}
            linkField={linkField}
          />
          <PageButtons
            pages={pages}
            currentPageNum={pageNum}
            onClick={(pageNum) => {
              onPageChange(pageNum);
              setPageNum(pageNum);
            }}
          />
        </>
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
  props: TableContainer<K>,
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
