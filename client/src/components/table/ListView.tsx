import { useMemo } from "react";
import { useListView } from "../../context/listView-context";
import Tile from "./Tile";
import Table from "./Table";
import { TableProps } from "../../types/table";
import { useFilter } from "../../context/filter-context";
import { useSort } from "../../context/sort-context";
import { ViewMode } from "../../types/types";
import { convertToDisplayListData } from "../modals/Detail/utils/convertToDisplayListData ";
import { useModal } from "../../context/modal-context";
import { PageButtons } from "./PageButtons";
import { hasId } from "../../utils/data/getIdKey";

function getPageNumbers(current: number, total: number): (number | "...")[] {
  const pages: (number | "...")[] = [];

  if (total <= 7) {
    // 少ない場合は全部表示
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1); // 最初のページ

    if (current > 4) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 3) pages.push("...");

    pages.push(total); // 最後のページ
  }

  return pages;
}

const ListView = <T,>({
  modelType,
  datas,
  totalCount,
  headers,
  linkField,
  form = false,
  onClick,
  selectedKey = [],
  selectedKeys,
  onPageChange,
  edit,
  renderFieldCell,
  deleteOnClick,
}: TableProps<T>) => {
  const {
    itemsPerPage,
    viewMode,
    pageNum,
    setPageNum,
    rowSpacing,
    columnVisibility,
  } = useListView();

  const { filterConditions } = useFilter();
  const { sortConditions } = useSort();
  const {
    detail: { open },
  } = useModal();

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
    <div className="max-h-[50rem] overflow-y-auto">
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
          onActionClick={onClick}
          onDetailClick={onDetailClick}
          onDeleteClick={deleteOnClick}
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
            onActionClick={onClick}
            onDetailClick={onDetailClick}
            onDeleteClick={deleteOnClick}
          />
        </div>
      )}

      <PageButtons
        pages={pages}
        currentPageNum={pageNum}
        onClick={(pageNum) => {
          onPageChange &&
            onPageChange(pageNum, filterConditions, sortConditions);
          setPageNum(pageNum);
        }}
      />
    </div>
  );
};

export default ListView;
