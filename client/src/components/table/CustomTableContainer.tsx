import { useEffect, useState } from "react";

import Table from "./Table";
import TableToolbar from "./TableToolbar";
import { Sort, Filter } from "../modals/index";

import { LinkField, TableHeader } from "../../types/types";
import { FormTypeMap, ModelType } from "../../types/models";

import { useSort } from "../../context/sort-context";
import { ModelRouteMap } from "../../types/models";
import { useFilter } from "../../context/filter-context";
import { useQuery } from "../../context/query-context";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "../../../../shared/types";

type Base<K extends keyof FormTypeMap> = {
  title?: string;
  headers: TableHeader[];
  modelType?: ModelType | null;
  formInitialData?: Partial<FormTypeMap[K]>;
  linkField?: LinkField[];
};

type Original<K extends keyof FormTypeMap> = Base<K> & {
  items: any[];
  itemsLoading?: boolean;
  originalFilterField?: FilterableFieldDefinition[];
  originalSortField?: SortableFieldDefinition[];
  detailLinkValue?: string | null;
  pageNum: number;
  totalCount?: number;
  handlePageChange?: (page: number) => Promise<void>;
  uploadFile?: (file: File) => Promise<boolean>;
  reloadFun?: () => Promise<void>;
  form?: boolean;
  onClick?: (row: any) => void;
  selectedKey?: string[];
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
  originalFilterField,
  originalSortField,
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

      <Filter
        filterableField={originalFilterField || []}
        onApply={handleApplyFilter}
      />
      <Sort
        sortableField={originalSortField || []}
        onApply={handleApplyFilter}
      />
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
