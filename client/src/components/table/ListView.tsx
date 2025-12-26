import { useEffect, useMemo } from "react";
import { useListView } from "../../context/listView-context";
import Tile from "./Tile";
import Table from "./Table";
import { TableProps } from "../../types/table";

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

const ListView = <T extends Record<string, any>>({
  data = [],
  totalCount,
  headers = [],
  pageNation = "client",
  linkField,
  detailLink = "",
  form = false,
  onClick = () => {},
  selectedKey = [],
  itemsPerPage,
  isLoading,
  currentPage,
  onPageChange,
  edit,
  renderFieldCell,
  deleteOnClick,
}: TableProps<T>) => {
  const { viewMode, pageNum, setPageNum } = useListView();

  useEffect(() => setPageNum(currentPage ? currentPage : 1), [currentPage]);

  const pageChange = useMemo(
    () => (onPageChange ? onPageChange : setPageNum),
    [onPageChange]
  );

  const totalPages =
    itemsPerPage && totalCount
      ? Math.max(Math.ceil(totalCount / itemsPerPage), 1)
      : itemsPerPage
      ? Math.ceil(data.length / itemsPerPage)
      : 1;

  const pages = getPageNumbers(pageNum, totalPages);

  return (
    <div className="max-h-[50rem] overflow-y-auto">
      {viewMode === "table" && (
        <Table
          data={data}
          totalCount={totalCount}
          headers={headers}
          pageNation={pageNation}
          linkField={linkField}
          detailLink={detailLink}
          itemsPerPage={10}
          isLoading={isLoading}
          currentPage={pageNum}
          onPageChange={onPageChange}
          form={form}
          onClick={onClick}
          selectedKey={selectedKey}
          edit={edit}
          renderFieldCell={renderFieldCell}
          deleteOnClick={deleteOnClick}
        />
      )}
      {viewMode === "tile" && (
        <Tile
          data={data}
          totalCount={totalCount}
          headers={headers}
          pageNation={pageNation}
          linkField={linkField}
          detailLink={detailLink}
          itemsPerPage={10}
          isLoading={isLoading}
          currentPage={pageNum}
          onPageChange={onPageChange}
          form={form}
          onClick={onClick}
          selectedKey={selectedKey}
          edit={edit}
          renderFieldCell={renderFieldCell}
          deleteOnClick={deleteOnClick}
        />
      )}
      {pages.length > 1 ? (
        <div className="flex justify-center m-4 space-x-2">
          {pages.map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-2">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => {
                  pageChange(page);
                }}
                className={`px-3 py-1 border rounded ${
                  pageNum === page ? "bg-blue-500 text-white" : "bg-white"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
      ) : (
        <div className="flex justify-center mb-5 space-x-2"></div>
      )}
    </div>
  );
};

export default ListView;
