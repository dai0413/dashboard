import { createContext, ReactNode, useContext, useState } from "react";

type ViewMode = "table" | "tile";
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
};

const ListViewContext = createContext<ListViewContextType | null>(null);

const ListViewProvider = ({ children }: { children: ReactNode }) => {
  const [pageNum, setPageNum] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [rowSpacing, setRowSpacing] = useState<RowSpacing>("narrow");
  const [updateTrigger, setUpdateTrigger] = useState<boolean>(false);

  const triggerUpdate = () => setUpdateTrigger((v) => !v);

  const value = {
    viewMode,
    setViewMode,
    rowSpacing,
    setRowSpacing,
    pageNum,
    setPageNum,
    updateTrigger,
    triggerUpdate,
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
    throw new Error("useAuth must be used within an ListViewProvider");
  }
  return context;
};

export { ListViewProvider, useListView };
