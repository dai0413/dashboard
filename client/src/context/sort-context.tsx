import { createContext, ReactNode, useContext, useState } from "react";

type SortCondition = {
  key: string;
  asc: boolean | null;
};

type SortState = {
  sortConditions: SortCondition[];
  setSortConditions: (conditions: SortCondition[]) => void;
  data: any[];
  setData: (data: any[]) => void;
  initializeSort: (data: any[]) => void;

  moveSortConditionUp: (index: number) => void;
  moveSortConditionDown: (index: number) => void;
  toggleAsc: (key: string, asc: boolean) => void;

  handleSort: () => void;
  resetSort: () => void;

  sortOpen: boolean;
  closeSort: () => void;
  openSort: () => void;
};

const defaultValue: SortState = {
  sortConditions: [],
  setSortConditions: () => {},
  data: [],
  setData: () => {},
  initializeSort: () => {},

  moveSortConditionUp: () => {},
  moveSortConditionDown: () => {},
  toggleAsc: () => {},

  handleSort: () => {},
  resetSort: () => {},

  sortOpen: false,
  closeSort: () => {},
  openSort: () => {},
};

const SortContext = createContext<SortState>(defaultValue);

const SortProvider = ({ children }: { children: ReactNode }) => {
  const [sortConditions, setSortConditions] = useState<SortCondition[]>(
    defaultValue.sortConditions
  );
  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);

  const initializeSort = (data: any[], force = false) => {
    setData(data);

    setSortConditions((prev: SortCondition[]) => {
      if (!force && prev.length > 0) return prev;
      return Object.keys(data[0]).map((field) => ({
        key: field,
        asc: null,
      }));
    });
  };

  // ソート
  const handleSort = (): void => {
    console.log("sort condition", sortConditions);
    console.log("table data is ", data);
    const sorted = [...data].sort((a, b) => {
      for (const { key, asc } of sortConditions) {
        if (asc === null) continue;

        const aValue = a[key];
        const bValue = b[key];

        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;
        if (aValue === bValue) continue;

        if (typeof aValue === "number" && typeof bValue === "number") {
          return asc ? aValue - bValue : bValue - aValue;
        }

        // 日付比較
        const aDate = Date.parse(aValue);
        const bDate = Date.parse(bValue);
        const isDateAValid = !isNaN(aDate);
        const isDateBValid = !isNaN(bDate);

        if (isDateAValid && isDateBValid) {
          return asc ? aDate - bDate : bDate - aDate;
        }

        // 文字列比較
        return asc
          ? String(aValue).localeCompare(String(bValue), "ja", {
              numeric: true,
            })
          : String(bValue).localeCompare(String(aValue), "ja", {
              numeric: true,
            });
      }
      return 0;
    });

    setData(sorted); // ソート後のデータを更新
    closeSort();
  };

  // リセット
  const resetSort = () => {
    console.log("reset start");
    initializeSort(data, true);
    // setData(data);
  };

  const openSort = () => setSortOpen(true);

  const closeSort = () => setSortOpen(false);

  const moveSortConditionDown = (index: number) => {
    setSortConditions((prev) => {
      if (index >= prev.length - 1) return prev; // 最後のアイテムなら移動しない

      const newConditions = [...prev];
      // 現在のアイテムと次のアイテムを交換
      [newConditions[index], newConditions[index + 1]] = [
        newConditions[index + 1],
        newConditions[index],
      ];
      return newConditions;
    });
  };

  const moveSortConditionUp = (index: number) => {
    if (index === 0) return; // 最初のアイテムなら移動しない

    setSortConditions((prev) => {
      const newConditions = [...prev];
      // 現在のアイテムと前のアイテムを交換
      [newConditions[index - 1], newConditions[index]] = [
        newConditions[index],
        newConditions[index - 1],
      ];
      return newConditions;
    });
  };

  const toggleAsc = (key: string, asc: boolean) => {
    setSortConditions((prev) => {
      console.log(prev);
      const existing = prev.find((c) => c.key === key);

      if (existing) {
        // 同じ値が選ばれていた → null に戻す
        if (existing.asc === asc) {
          return prev.map((c) => (c.key === key ? { ...c, asc: null } : c));
        }

        // 昇⇄降の切り替え
        return prev.map((c) => (c.key === key ? { ...c, asc } : c));
      }

      return [...prev];
    });
  };

  const value = {
    sortConditions,
    setSortConditions,
    data,
    setData,
    initializeSort,

    moveSortConditionUp,
    moveSortConditionDown,
    toggleAsc,

    handleSort,
    resetSort,

    sortOpen,
    closeSort,
    openSort,
  };

  return <SortContext.Provider value={value}>{children}</SortContext.Provider>;
};

const useSort = () => {
  const context = useContext(SortContext);
  if (!context) {
    throw new Error("useSort must be used within a SortProvider");
  }
  return context;
};

export { useSort, SortProvider };
