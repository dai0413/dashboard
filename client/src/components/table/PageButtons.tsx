type PageButtons = {
  currentPageNum: number;
  pages: (number | "...")[];
  onClick: (page: number) => void;
};

export const PageButtons = ({
  currentPageNum,
  pages,
  onClick,
}: PageButtons) => {
  return (
    <>
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
                onClick={() => onClick(page)}
                className={`px-3 py-1 border rounded ${
                  currentPageNum === page
                    ? "bg-blue-500 text-white"
                    : "bg-white"
                }`}
              >
                {page}
              </button>
            ),
          )}
        </div>
      ) : (
        <div className="flex justify-center mb-5 space-x-2"></div>
      )}
    </>
  );
};
