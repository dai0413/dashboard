import { Loader2 } from "lucide-react";
import DataView from "./DataView/DataView";
import { PageButtons } from "../PageButtons";
import { TableData, TableHeader } from "../../../types/table";
import { ModelType } from "../../../types/models";
import { LinkField, ViewMode } from "../../../types/types";
import { UIFieldDefinition } from "../../../types/field";
import { ReactNode } from "react";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { useDataView } from "../../../context/dataView-context";

type Props<T> = {
  datas: TableData<T>;
  isLoading?: boolean;

  totalCount: number;
  modelType?: ModelType;
  linkField?: LinkField[];
  fieldDefinitions?: UIFieldDefinition<T>[];

  /** 単一データ編集モード */
  form?: boolean;
  onActionClick?: (index: number, row: T) => void;
  selectedKey?: string[];

  /** 複数データ編集モード */
  edit?: boolean;
  renderFieldCell?: (
    header: TableHeader<T>,
    row: T,
    rowIndex: number,
  ) => React.ReactNode;
  deleteOnClick?: (index: number) => void;
  selectedKeys?: Record<number, string[]>;

  // レンダリング
  noItemMessage?: ReactNode;
  renderView?: (params: {
    items: TableData<T>;
    totalCount: number;
    isLoading: boolean;
    filterConditions?: FilterableFieldDefinition[];
    sortConditions?: SortableFieldDefinition[];
  }) => React.ReactNode;

  pages: (number | "...")[];
  pageNum: number;
  onPageChange: (page: number) => void;
  viewOptions?: {
    calendar?: {
      currentDate: Date;
      setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
    };
  };
};

export const DataViewContent = <K extends Record<string, unknown>>({
  totalCount,
  modelType,
  linkField,
  fieldDefinitions,
  isLoading,
  datas,

  form,
  onActionClick,
  selectedKey,

  edit,
  renderFieldCell,
  deleteOnClick,
  selectedKeys,

  noItemMessage,
  renderView,

  pages,
  pageNum,
  onPageChange,
  viewOptions,
}: Props<K>) => {
  const { viewMode } = useDataView();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="bg-gray-50 px-8 py-10 text-center">
          <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
        </div>
      </div>
    );
  }

  if (datas.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-8 py-10 text-center">
          <p className="mb-2 text-lg font-semibold text-gray-600">
            表示するデータがありません
          </p>
          {noItemMessage}
        </div>
      </div>
    );
  }

  if (renderView) {
    return (
      <div className="flex justify-center">
        {renderView({
          items: datas,
          totalCount: totalCount,
          isLoading: isLoading || false,
        })}
      </div>
    );
  }

  return (
    <div className="max-h-[50rem] overflow-y-auto">
      <DataView<K>
        modelType={modelType}
        datas={datas}
        headers={fieldDefinitions}
        linkField={linkField}
        form={form}
        onActionClick={onActionClick}
        selectedKey={selectedKey}
        renderFieldCell={renderFieldCell}
        edit={edit}
        selectedKeys={selectedKeys}
        onDeleteClick={deleteOnClick}
        viewOptions={viewOptions}
      />
      {(viewMode === ViewMode.TABLE || viewMode === ViewMode.TILE) && (
        <PageButtons
          pages={pages}
          currentPageNum={pageNum}
          onClick={onPageChange}
        />
      )}
    </div>
  );
};
