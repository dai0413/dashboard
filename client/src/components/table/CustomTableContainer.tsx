import { useEffect, useState } from "react";

import Table from "./Table";
import TableToolbar from "./TableToolbar";
import { Sort, Filter } from "../modals/index";

import { FormTypeMap, ModelType } from "../../types/models";
import { ModelRouteMap } from "../../types/models";
import { TableBase, TableOperationFields } from "../../types/table";

import { useSort } from "../../context/sort-context";
import { useFilter } from "../../context/filter-context";
import { useQuery } from "../../context/query-context";

type TablePage = {
  pageNum: number;
  totalCount?: number;
  handlePageChange?: (page: number) => Promise<void>;
};

type TableForm = {
  form?: boolean;
  onClick?: (row: any) => void;
  selectedKey?: string[];
};

type Original<K extends ModelType> = TableBase<K> &
  TableOperationFields &
  TablePage &
  TableForm & {
    items: any[];
    itemsLoading?: boolean;

    uploadFile?: (file: File) => Promise<boolean>;
    reloadFun?: () => Promise<void>;
  };

type TableContainerProps<K extends keyof FormTypeMap> = Original<K>;

const CustomTableContainer = <K extends keyof FormTypeMap>({
  title,
  headers,
  modelType,
  formInitialData,
  linkField,
  items,
  itemsLoading,
  filterField,
  sortField,
  detailLinkValue,
  pageNum,
  totalCount,
  handlePageChange,
  uploadFile,
  reloadFun,
  form,
  onClick,
  selectedKey,
}: TableContainerProps<K>) => {
  const { closeSort } = useSort();
  const { closeFilter } = useFilter();
  const { setPage } = useQuery();

  const [rowSpacing, setRowSpacing] = useState<"wide" | "narrow">("narrow");

  const [updateTrigger, setUpdateTrigger] = useState<boolean>(false);

  useEffect(() => {
    handleApplyFilter();
  }, [updateTrigger]);

  const handleApplyFilter = async () => {
    handlePageChange && (await handlePageChange(1));
    closeFilter();
    closeSort();
  };

  const detailLink = detailLinkValue
    ? detailLinkValue
    : modelType
    ? ModelRouteMap[modelType]
    : "";

  const onPageChange = async (page: number) => {
    handlePageChange && (await handlePageChange(page));
    setPage("page", page);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg max-w-7xl w-full mx-auto">
      {title && (
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
      )}

      <Filter filterableField={filterField || []} onApply={handleApplyFilter} />
      <Sort sortableField={sortField || []} onApply={handleApplyFilter} />
      <TableToolbar
        rowSpacing={rowSpacing}
        setRowSpacing={setRowSpacing}
        modelType={modelType}
        uploadFile={uploadFile}
        formInitialData={formInitialData}
        handleUpdateTrigger={() => {
          setUpdateTrigger((prev) => !prev);
        }}
        reloadFun={reloadFun}
      />
      <Table
        data={items}
        totalCount={totalCount}
        headers={headers}
        pageNation="server"
        linkField={linkField}
        detailLink={detailLink}
        rowSpacing={rowSpacing}
        itemsPerPage={10}
        isLoading={itemsLoading}
        currentPage={pageNum}
        onPageChange={onPageChange}
        form={form}
        onClick={onClick}
        selectedKey={selectedKey}
      />
    </div>
  );
};

export default CustomTableContainer;
