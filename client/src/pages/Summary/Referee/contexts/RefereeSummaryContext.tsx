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

  const [loadedRefereeId, setLoadedRefereeId] = useState<string | null>(null);

  const { getCache, saveCache, isCacheComplete } = useRefereeSummaryCache();

  const handleSelectedTab = useCallback(
    (value: string | number | Date | undefined) => {
      const tab = value as RefereeTab;
      setSelectedTab(tab);

      if (loadedRefereeId) {
        saveCache(loadedRefereeId, { selectedTab: tab });
      }
    },
    [loadedRefereeId, saveCache],
  );

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

  const fetchRefereeData = useCallback(
    async (id: string) => {
      setLoadedRefereeId(null); // 読み込み中は「未確定」にする
      const isStale = () => latestIdRef.current !== id;

      if (selected?._id !== id) {
        await readItem(id);
        if (isStale()) return;
      }

      if (isStale()) return;

      const result = await readDatas(id);
      const selectedTab = getCache(id)?.selectedTab ?? DEFAULT_TAB;
      const cache = {
        ...result,
        selectedTab,
      };

      saveCache(id, cache);

      if (isStale()) return;
      setLoadedRefereeId(id);
    },
    [selected?._id, readItem, readDatas, saveCache, getCache],
  );

  const activateId = useCallback(
    async (id: string) => {
      latestIdRef.current = id;

      if (loadedRefereeId === id) {
        return;
      }

      setSelectedTab(getCache(id)?.selectedTab ?? DEFAULT_TAB);
      const cached = getCache(id);

      if (cached && isCacheComplete(id)) {
        if (selected?._id !== id) {
          await readItem(id);
        }

        if (latestIdRef.current !== id) return;

        restoreCache(cached);
        setLoadedRefereeId(id);
        return;
      }

      await fetchRefereeData(id);
    },
    [
      loadedRefereeId,
      selected?._id,
      getCache,
      isCacheComplete,
      readItem,
      restoreCache,
      fetchRefereeData,
    ],
  );

  const value: UseRefereeSummary = {
    id: loadedRefereeId,
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
