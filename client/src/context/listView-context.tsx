import { createContext, ReactNode, useContext, useState } from "react";
import { ViewMode } from "../types/types";

type RowSpacing = "wide" | "narrow";

type ListViewContextType = {
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;

  rowSpacing: RowSpacing;
  setRowSpacing: (v: RowSpacing) => void;

  pageNum: number;
  setPageNum: (p: number) => void;

  updateTrigger: boolean;
  triggerUpdate: () => void;

  itemsPerPage: number | null;
  setItemsPerPage: (n: number | null) => void;

  columnVisibility: Record<string, boolean>;
  setColumnVisibility: (v: Record<string, boolean>) => void;
};

const ListViewContext = createContext<ListViewContextType | null>(null);

const ListViewProvider = ({ children }: { children: ReactNode }) => {
  const [pageNum, setPageNum] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.TABLE);
  const [rowSpacing, setRowSpacing] = useState<RowSpacing>("narrow");
  const [updateTrigger, setUpdateTrigger] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});

  const triggerUpdate = () => {
    setUpdateTrigger((v) => !v);
  };

  const value = {
    viewMode,
    setViewMode,
    rowSpacing,
    setRowSpacing,
    pageNum,
    setPageNum,
    updateTrigger,
    triggerUpdate,
    itemsPerPage,
    setItemsPerPage,
    columnVisibility,
    setColumnVisibility,
  };

  return (
    <ListViewContext.Provider value={value}>
      {children}
    </ListViewContext.Provider>
  );
};

const useListView = () => {
  const context = useContext(ListViewContext);
  if (!context) {
    throw new Error("useListView must be used within an ListViewProvider");
  }
  return context;
};

export { ListViewProvider, useListView };
