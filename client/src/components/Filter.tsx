import { createPortal } from "react-dom";
import { LinkButtonGroup } from "../components/index";
import { useFilter } from "../context/filter-context";

const Filter = () => {
  const { filterValue, backFilter, searchValue, handleFilterValueChange } =
    useFilter();

  const modalContent = (
    <div className="fixed inset-0 bg-gray-500/10 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-gray-100 p-8 rounded-lg shadow-xl border border-gray-300 w-full max-w-md">
        <div className="mb-4">
          <input
            type="text"
            value={filterValue}
            onChange={handleFilterValueChange}
            placeholder="フィルター..."
            className="px-4 py-2 border rounded-md w-full"
          />
        </div>
        <LinkButtonGroup
          approve={{ text: "戻る", color: "red", onClick: backFilter }}
          deny={{
            text: "検索",
            color: "green",
            onClick: searchValue,
          }}
        />
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Filter;
