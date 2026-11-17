import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  REFEREE_TAB,
  RefereeSummaryCache,
  RefereeTab,
  UseRefereeSummary,
} from "../types";
import { useRefereeSummaryCache } from "../hooks/useRefereeSummaryCache";
import { useReferee } from "../../../../context/models/referee";

const RefereeSummaryContext = createContext<UseRefereeSummary | null>(null);

type Props = {
  children: React.ReactNode;
};

const DEFAULT_TAB = REFEREE_TAB.TOP;

export const RefereeSummaryProvider = ({ children }: Props) => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = useReferee();

  const [selectedTab, setSelectedTab] = useState<RefereeTab>(DEFAULT_TAB);

  const [loadedPlaeyrId, setLoadedPlaeyrId] = useState<string | null>(null);

  const { getCache, saveCache, isCacheComplete } = useRefereeSummaryCache();

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as RefereeTab);
  };

  const restoreCache = useCallback(
    (_cached: Partial<RefereeSummaryCache>) => {},
    [],
  );

  // id変更, season変更両方で読み込む
  const readDatas = useCallback(
    async (_refereeId: string): Promise<Partial<RefereeSummaryCache>> => {
      const [] = await Promise.all([]);

      return {};
    },
    [selected?._id],
  );

  const latestIdRef = useRef<string | null>(null);

  const fetchPlaeyrData = useCallback(
    async (id: string) => {
      setLoadedPlaeyrId(null); // 読み込み中は「未確定」にする
      const isStale = () => latestIdRef.current !== id;

      if (selected?._id !== id) {
        await readItem(id);
        if (isStale()) return;
      }

      if (isStale()) return;

      const result = await readDatas(id);

      // 取得できたデータは正しいのでキャッシュには残す
      saveCache(id, { ...result });

      if (isStale()) return; // 状態への反映だけやめる
      setLoadedPlaeyrId(id);
    },
    [selected?._id, readItem, readDatas, saveCache],
  );

  const activateId = useCallback(
    async (id: string) => {
      latestIdRef.current = id;

      if (loadedPlaeyrId === id) {
        console.log("取得済みのためスキップ", id);
        return;
      }

      const cached = getCache(id);

      if (cached && isCacheComplete(id)) {
        if (selected?._id !== id) {
          await readItem(id);
        }

        if (latestIdRef.current !== id) return;

        setSelectedTab(DEFAULT_TAB);
        restoreCache(cached);
        setLoadedPlaeyrId(id);
        return;
      }

      console.log("データ取得開始", id);

      await fetchPlaeyrData(id);
    },
    [
      loadedPlaeyrId,
      selected?._id,
      getCache,
      isCacheComplete,
      readItem,
      restoreCache,
      fetchPlaeyrData,
    ],
  );

  const value: UseRefereeSummary = {
    id: loadedPlaeyrId,
    isLoading,
    selected,
    activateId,

    tab: {
      selectedTab,
      handleSelect: handleSelectedTab,
    },

    panels: {},
  };

  return (
    <RefereeSummaryContext.Provider value={value}>
      {children}
    </RefereeSummaryContext.Provider>
  );
};

export const useRefereeSummary = () => {
  const context = useContext(RefereeSummaryContext);

  if (!context) {
    throw new Error(
      "useRefereeSummary must be used within RefereeSummaryProvider",
    );
  }

  return context;
};
