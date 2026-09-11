import { createContext, ReactNode, useContext, useState } from "react";
import { RowSpacing, ViewMode } from "../types/types";

type DataViewContextType = {
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

const DataViewContext = createContext<DataViewContextType | null>(null);

const DataViewProvider = ({ children }: { children: ReactNode }) => {
  const [pageNum, setPageNum] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.TABLE);
  const [rowSpacing, setRowSpacing] = useState<RowSpacing>(RowSpacing.NARROW);
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
    <DataViewContext.Provider value={value}>
      {children}
    </DataViewContext.Provider>
  );
};

const useDataView = () => {
  const context = useContext(DataViewContext);
  if (!context) {
    throw new Error("useDataView must be used within an DataViewProvider");
  }
  return context;
};

export { DataViewProvider, useDataView };
