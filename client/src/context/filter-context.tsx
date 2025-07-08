import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { FilterCondition } from "../types/types";

type FilterState = {
  filterOpen: boolean;
  filterConditions: FilterCondition[];
  handleAddCondition: (filterCondition: FilterCondition) => void;
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
  searchValue: () => void;
  backFilter: () => void;
  openFilter: () => void;
  closeFilter: () => void;
};

const defaultValue: FilterState = {
  filterOpen: false,
  filterConditions: [],
  handleAddCondition: () => {},
  handleEdit: () => {},
  handleDelete: () => {},
  searchValue: () => {},
  backFilter: () => {},
  openFilter: () => {},
  closeFilter: () => {},
};

const FilterContext = createContext<FilterState>(defaultValue);

const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([
    {
      key: "doa",
      label: "移籍発表日",
      value: "2025/07/07",
      type: "Date",
      operator: "equals",
    },
  ]);

  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    console.log("new filterConditions", filterConditions);
  }, [filterConditions]);

  // add filter contition
  const handleAddCondition = (filterCondition: FilterCondition) => {
    const { key, value, label, type, operator } = filterCondition;
    if (!key || value == "") return;

    setFilterConditions((prev) => [
      ...prev,
      {
        key: key,
        label: label,
        value: value,
        type: type,
        operator: operator,
        logic: prev.length === 0 ? "AND" : "AND",
      },
    ]);

    // setFieldKey("");
    // setFieldValue("");
    // setSelectedKey("string");
  };

  const handleEdit = () => {};

  const handleDelete = (index: number) => {
    setFilterConditions((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------- add filter ----------
  const handleFilter = (data: any[]): any[] => {
    // filterConditions.map((filCod) => {
    //   if (filCod.key in data)
    // })

    return data;
  };

  //   検索
  const searchValue = () => {
    // setFilter(fieldValue);
    setFilterOpen(false);
  };

  //   戻るボタン
  const backFilter = () => {
    // setFieldValue(filter);
    setFilterOpen(false);
  };

  // フィルターオープン
  const openFilter = () => {
    setFilterOpen(true);
  };

  const closeFilter = () => {
    setFilterOpen(false);
  };

  const value = {
    ...defaultValue,
    filterOpen,
    filterConditions,
    handleAddCondition,
    handleDelete,

    searchValue,
    backFilter,
    openFilter,
    closeFilter,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};

export { useFilter, FilterProvider };
