import { createContext, ReactNode, useContext, useState } from "react";
import { SortableFieldDefinition } from "@myorg/shared";

type SortState = {
  sortConditions: SortableFieldDefinition[];
  setSortConditions: (conditions: SortableFieldDefinition[]) => void;
  data: any[];
  setData: (data: any[]) => void;

  moveSortConditionUp: (index: number) => void;
  moveSortConditionDown: (index: number) => void;
  toggleAsc: (key: string, asc: boolean) => void;

  resetSort: (sortableField: SortableFieldDefinition[]) => void;

  sortOpen: boolean;
  closeSort: () => void;
  openSort: () => void;
};

const defaultValue: SortState = {
  sortConditions: [],
  setSortConditions: () => {},
  data: [],
  setData: () => {},

  moveSortConditionUp: () => {},
  moveSortConditionDown: () => {},
  toggleAsc: () => {},

  resetSort: () => {},

  sortOpen: false,
  closeSort: () => {},
  openSort: () => {},
};

const SortContext = createContext<SortState>(defaultValue);

const SortProvider = ({ children }: { children: ReactNode }) => {
  const [sortConditions, setSortConditions] = useState<
    SortableFieldDefinition[]
  >(defaultValue.sortConditions);
  const [sortOpen, setSortOpen] = useState<boolean>(false);

  // リセット
  const resetSort = (sortableField: SortableFieldDefinition[]): void => {
    const sortConditions = sortableField?.length
      ? sortableField.map((fie) => ({ ...fie, asc: null }))
      : [];

    setSortConditions(sortConditions);
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
      // console.log(prev);
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
    ...defaultValue,
    sortConditions,
    setSortConditions,

    moveSortConditionUp,
    moveSortConditionDown,
    toggleAsc,

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
