import { useMemo } from "react";
import { useListView } from "../../context/listView-context";
import Tile from "./Tile";
import Table from "./Table";
import { TableData, TableHeader } from "../../types/table";
import { LinkField, ViewMode } from "../../types/types";
import { convertToDisplayListData } from "../modals/Detail/utils/convertToDisplayListData ";
import { useModal } from "../../context/modal-context";
import { hasId } from "../../utils/data/getIdKey";
import { ModelType } from "../../types/models";

type ListViewProps<T> = {
  modelType?: ModelType;
  datas: TableData<T>;
  headers: TableHeader<T>[];
  linkField?: LinkField[];
  form?: boolean;
  selectedKey?: string[];
  selectedKeys?: Record<number, string[]>;
  edit?: boolean;
  renderFieldCell?: (
    header: TableHeader<T>,
    row: T,
    rowIndex: number,
  ) => React.ReactNode;
  onActionClick?: (index: number, row: T) => void;
  onDeleteClick?: (index: number) => void;
};

const ListView = <T,>({
  modelType,
  datas,
  headers,
  linkField,
  form = false,
  selectedKey = [],
  selectedKeys,
  edit,
  renderFieldCell,
  onActionClick,
  onDeleteClick,
}: ListViewProps<T>) => {
  const { viewMode, rowSpacing, columnVisibility } = useListView();

  const {
    detail: { open },
  } = useModal();

  const onDetailClick = useMemo(() => {
    if (!modelType) {
      return undefined;
    }

    return (row: T) => {
      if (!hasId(row)) {
        return;
      }

      open(
        modelType,
        row._id,
        convertToDisplayListData({
          data: row,
          model: {
            modelType,
            linkField: linkField || [],
          },
        }),
      );
    };
  }, [modelType, linkField, open]);

  const visibleHeaders = useMemo(
    () => headers.filter((h) => columnVisibility[h.key]),
    [headers, columnVisibility],
  );

  return (
    <>
      {viewMode === ViewMode.TABLE && (
        <Table
          datas={datas}
          headers={visibleHeaders}
          linkField={linkField}
          rowSpacing={rowSpacing}
          form={form}
          selectedKey={selectedKey}
          selectedKeys={selectedKeys}
          edit={edit}
          renderFieldCell={renderFieldCell}
          onActionClick={onActionClick}
          onDetailClick={onDetailClick}
          onDeleteClick={onDeleteClick}
        />
      )}
      {viewMode === ViewMode.TILE && (
        <div className="mx-5">
          <Tile
            datas={datas}
            headers={visibleHeaders}
            linkField={linkField}
            rowSpacing={rowSpacing}
            form={form}
            selectedKey={selectedKey}
            selectedKeys={selectedKeys}
            edit={edit}
            renderFieldCell={renderFieldCell}
            onActionClick={onActionClick}
            onDetailClick={onDetailClick}
            onDeleteClick={onDeleteClick}
          />
        </div>
      )}
    </>
  );
};

export default ListView;
