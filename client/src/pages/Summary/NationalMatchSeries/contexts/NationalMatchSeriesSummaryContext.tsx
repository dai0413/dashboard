import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  NATIONAL_MATCH_SERIES_TAB,
  NationalMatchSeriesSummaryCache,
  NationalMatchSeriesTab,
  UseNationalMatchSeriesSummary,
} from "../types";
import { useMatchPanel, useNationalCallupPanel } from "../hooks";
import { useNationalMatchSeriesSummaryCache } from "../hooks/useNationalMatchSeriesSummaryCache";
import { useNationalMatchSeries } from "../../../../context/models/national-match-series";

const NationalMatchSeriesSummaryContext =
  createContext<UseNationalMatchSeriesSummary | null>(null);

type Props = {
  children: React.ReactNode;
};

const DEFAULT_TAB = NATIONAL_MATCH_SERIES_TAB.MATCH;

export const NationalMatchSeriesSummaryProvider = ({ children }: Props) => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = useNationalMatchSeries();

  const [selectedTab, setSelectedTab] =
    useState<NationalMatchSeriesTab>(DEFAULT_TAB);

  const matchIds = useMemo(() => {
    return (
      selected?.matches
        ?.map((d) => d.id)
        .filter((d): d is string => typeof d === "string") ?? []
    );
  }, [selected]);

  const [loadedNationalMatchSeriesId, setLoadedNationalMatchSeriesId] =
    useState<string | null>(null);

  const { getCache, saveCache, isCacheComplete } =
    useNationalMatchSeriesSummaryCache();

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as NationalMatchSeriesTab);
  };

  const { matches, readMatches, setMatches } = useMatchPanel();
  const { nationalCallups, readNationalCallups, setNationalCallups } =
    useNationalCallupPanel();

  const restoreCache = useCallback(
    (cached: Partial<NationalMatchSeriesSummaryCache>) => {
      if (cached.match !== undefined) {
        setMatches(cached.match);
      }

      if (cached.nationalCallup !== undefined) {
        setNationalCallups(cached.nationalCallup);
      }
    },
    [setMatches, setNationalCallups],
  );

  // id変更, season変更両方で読み込む
  const readDatas = useCallback(
    async (
      matchIds: string[],
      seriesId: string,
    ): Promise<Partial<NationalMatchSeriesSummaryCache>> => {
      const [match, nationalCallup] = await Promise.all([
        readMatches(matchIds),
        readNationalCallups(seriesId),
      ]);

      return {
        ...(match && { match }),
        ...(nationalCallup && { nationalCallup }),
      };
    },
    [selected?._id, readMatches, readNationalCallups],
  );

  const latestIdRef = useRef<string | null>(null);

  const fetchNationalMatchSeriesData = useCallback(
    async (id: string) => {
      setLoadedNationalMatchSeriesId(null); // 読み込み中は「未確定」にする
      const isStale = () => latestIdRef.current !== id;

      if (selected?._id !== id) {
        await readItem(id);
        if (isStale()) return;
      }

      if (isStale()) return;

      const result = await readDatas(matchIds, id);

      // 取得できたデータは正しいのでキャッシュには残す
      saveCache(id, { ...result });

      if (isStale()) return; // 状態への反映だけやめる
      setLoadedNationalMatchSeriesId(id);
    },
    [selected?._id, readItem, matchIds, readDatas, saveCache],
  );

  const activateId = useCallback(
    async (id: string) => {
      latestIdRef.current = id;

      if (loadedNationalMatchSeriesId === id) {
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
        setLoadedNationalMatchSeriesId(id);
        return;
      }

      await fetchNationalMatchSeriesData(id);
    },
    [
      loadedNationalMatchSeriesId,
      selected?._id,
      getCache,
      isCacheComplete,
      readItem,
      restoreCache,
      fetchNationalMatchSeriesData,
    ],
  );

  const reloadAndCache = async <
    K extends keyof NationalMatchSeriesSummaryCache,
  >(
    key: K,
    read: () => Promise<NationalMatchSeriesSummaryCache[K] | null | undefined>,
  ) => {
    const id = loadedNationalMatchSeriesId;
    if (!id) return;

    const result = await read();
    if (!result) return;

    if (latestIdRef.current !== id) return;

    saveCache(id, {
      [key]: result,
    } as Partial<NationalMatchSeriesSummaryCache>);
  };

  const value: UseNationalMatchSeriesSummary = {
    id: loadedNationalMatchSeriesId,
    isLoading,
    selected,
    activateId,

    tab: {
      selectedTab,
      handleSelect: handleSelectedTab,
    },

    panels: {
      nationalCallup: {
        key: `${selectedTab}`,
        isLoading: nationalCallups.isLoading,
        items: nationalCallups.data,
        reloadFun: () =>
          reloadAndCache("nationalCallup", () =>
            readNationalCallups(loadedNationalMatchSeriesId!),
          ),
      },

      match: {
        key: `${selectedTab}`,
        isLoading: matches.isLoading,
        items: matches.data,
        reloadFun: () => reloadAndCache("match", () => readMatches(matchIds)),
      },
    },
  };

  return (
    <NationalMatchSeriesSummaryContext.Provider value={value}>
      {children}
    </NationalMatchSeriesSummaryContext.Provider>
  );
};

export const useNationalMatchSeriesSummary = () => {
  const context = useContext(NationalMatchSeriesSummaryContext);

  if (!context) {
    throw new Error(
      "useNationalMatchSeriesSummary must be used within NationalMatchSeriesSummaryProvider",
    );
  }

  return context;
};
