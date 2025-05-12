import { createContext, ReactNode, useContext, useState } from "react";

type FilterState = {
  filterOpen: boolean;
  filterValue: string;
  filter: string;
  handleFilterValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchValue: () => void;
  backFilter: () => void;
  openFilter: () => void;
  closeFilter: () => void;
};

const defaultValue: FilterState = {
  filterOpen: false,
  filterValue: "",
  filter: "",
  handleFilterValueChange: () => {},
  searchValue: () => {},
  backFilter: () => {},
  openFilter: () => {},
  closeFilter: () => {},
};

const FilterContext = createContext<FilterState>(defaultValue);

const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filterValue, setFilterValue] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const handleFilterValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterValue(value);
  };

  //   検索
  const searchValue = () => {
    setFilter(filterValue);
    setFilterOpen(false);
  };

  //   戻るボタン
  const backFilter = () => {
    setFilterValue(filter);
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
    filterOpen,
    filterValue,
    filter,
    handleFilterValueChange,
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
