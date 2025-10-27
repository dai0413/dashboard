import { useEffect, useMemo, useState } from "react";

import Table from "./Table";
import TableToolbar from "./TableToolbar";
import { Sort, Filter } from "../modals/index";

import { LinkField, TableHeader } from "../../types/types";
import { FormTypeMap, ModelType } from "../../types/models";

import { useSort } from "../../context/sort-context";
import { ModelRouteMap } from "../../types/models";
import { ModelContext } from "../../types/context";
import { useFilter } from "../../context/filter-context";
import { useQuery } from "../../context/query-context";

type Base<K extends keyof FormTypeMap> = {
  title?: string;
  headers: TableHeader[];
  modelType?: ModelType | null;
  formInitialData?: Partial<FormTypeMap[K]>;
  linkField?: LinkField[];
};

type ModelBase<K extends keyof FormTypeMap> = Base<K> & {
  modelType: ModelType;
  contextState: ModelContext<K>;
};

type TableContainerProps<K extends keyof FormTypeMap> = ModelBase<K>;

const ModelTableContainer = <K extends keyof FormTypeMap>(
  props: TableContainerProps<K>
) => {
  const { handleSort, closeSort } = useSort();
  const { handleFilter, closeFilter } = useFilter();
  const { setPage } = useQuery();

  const [rowSpacing, setRowSpacing] = useState<"wide" | "narrow">("narrow");
  const [tableData, setTableData] = useState<any[]>([]);

  const [updateTrigger, setUpdateTrigger] = useState<boolean>(false);

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
    setTableData(items);
  }, [updateTrigger, items]);

  const tableIsLoading = useMemo(() => isLoading, [isLoading]);
  const filterField = useMemo(() => filterableField, [filterableField]);
  const sortField = useMemo(() => sortableField, [sortableField]);

  const handleApplyFilter = () => {
    // const filterd = handleFilter(items);
    // const sorted = handleSort(filterd);
    // setTableData(sorted);
    closeFilter();
    closeSort();
  };

  const detailLink = ModelRouteMap[props.modelType];

  const onPageChange = async (page: number) => {
    readItems({ page: page });
    setPage("page", page);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg max-w-7xl w-full mx-auto">
      {props.title && (
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {props.title}
        </h2>
      )}

      <Filter filterableField={filterField} onApply={handleApplyFilter} />
      <Sort sortableField={sortField} onApply={handleApplyFilter} />
      <TableToolbar
        rowSpacing={rowSpacing}
        setRowSpacing={setRowSpacing}
        modelType={props.modelType}
        uploadFile={uploadFile}
        downloadFile={downloadFile}
        formInitialData={props.formInitialData}
        handleUpdateTrigger={() => {
          setUpdateTrigger((prev) => !prev);
        }}
      />
      <Table
        data={items}
        totalCount={totalCount}
        headers={props.headers}
        pageNation="server"
        linkField={props.linkField}
        detailLink={detailLink}
        rowSpacing={rowSpacing}
        itemsPerPage={10}
        isLoading={tableIsLoading}
        currentPage={page}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ModelTableContainer;
