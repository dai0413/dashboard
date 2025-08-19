import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

type PageMap = {
  page: number;
  formPage: number;
};

type QueryStage = {
  page: PageMap;
  setPage: (key: keyof PageMap, p: number) => void;
};
const defaultValue: QueryStage = {
  page: { page: 1, formPage: 1 },
  setPage: () => {},
};

const QueryContext = createContext<QueryStage>(defaultValue);

const QueryProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const initialPage = Number(query.get("page")) || 1;
  const initialFormPage = Number(query.get("formPage")) || 1;

  const [page, setPageState] = useState<PageMap>({
    page: initialPage,
    formPage: initialFormPage,
  });

  // キー付きでページ更新
  const setPage = (key: keyof PageMap, p: number) => {
    setPageState((prev) => ({ ...prev, [key]: p }));
    navigate(`?${key}=${p}`, { replace: true });
  };

  // URL 変更時に同期
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const newPage = Number(q.get("page")) || 1;
    const newFormPage = Number(q.get("formPage")) || 1;
    setPageState({ page: newPage, formPage: newFormPage });
  }, [location.search]);

  const value: QueryStage = { page, setPage };

  return (
    <QueryContext.Provider value={value}>{children}</QueryContext.Provider>
  );
};

const useQuery = () => {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error("useQuery must be used within a QueryProvider");
  }
  return context;
};

export { QueryProvider, useQuery };
