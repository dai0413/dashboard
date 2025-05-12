import { LinkButtonGroup } from "../buttons/index";
import { useFilter } from "../../context/filter-context";
import { Modal } from "../ui";

const Filter = () => {
  const {
    filterOpen,
    filterValue,
    backFilter,
    searchValue,
    handleFilterValueChange,
    closeFilter,
  } = useFilter();

  return (
    <Modal isOpen={filterOpen} onClose={closeFilter}>
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
    </Modal>
  );
};

export default Filter;
