import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  PLAYER_TAB,
  PlayerSummaryCache,
  PlayerTab,
  UsePlayerSummary,
} from "../types";
import {
  useInjuryPanel,
  useNationalCallupPanel,
  usePlayerRegistrationPanel,
  useStatisticsPanel,
  useTransferPanel,
} from "../hooks";
import { usePlayerSummaryCache } from "../hooks/usePlayerSummaryCache";
import { usePlayer } from "../../../../context/models/player";
import { createFormationItems } from "../utils/createFormationItems";
import { createTopPanelItems } from "../utils/createTopPanelItems";

const PlayerSummaryContext = createContext<UsePlayerSummary | null>(null);

type Props = {
  children: React.ReactNode;
};

const DEFAULT_TAB = PLAYER_TAB.TOP;

export const PlayerSummaryProvider = ({ children }: Props) => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = usePlayer();

  const [selectedTab, setSelectedTab] = useState<PlayerTab>(DEFAULT_TAB);

  const [loadedPlaeyrId, setLoadedPlaeyrId] = useState<string | null>(null);

  const { getCache, saveCache, isCacheComplete } = usePlayerSummaryCache();

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as PlayerTab);
  };

  const { injuries, readinjuries, setInjuries } = useInjuryPanel();
  const { nationalCallups, readNationalCallups, setNationalCallups } =
    useNationalCallupPanel();
  const {
    playerRegistrations,
    readPlayerRegistrations,
    setPlayerRegistrations,
  } = usePlayerRegistrationPanel();
  const { transfers, readTransfers, setTransfers } = useTransferPanel();
  const { statistics, readStatistics, setStatistics } = useStatisticsPanel();

  const positions = useMemo(
    () => createFormationItems(statistics.data),
    [statistics],
  );

  const topItems = useMemo(
    () => createTopPanelItems(statistics.data),
    [statistics],
  );

  const restoreCache = useCallback(
    (cached: Partial<PlayerSummaryCache>) => {
      if (cached.injury !== undefined) {
        setInjuries(cached.injury);
      }

      if (cached.nationalCallup !== undefined) {
        setNationalCallups(cached.nationalCallup);
      }

      if (cached.playerRegistration !== undefined) {
        setPlayerRegistrations(cached.playerRegistration);
      }

      if (cached.transfer !== undefined) {
        setTransfers(cached.transfer);
      }

      if (cached.statistics !== undefined) {
        setStatistics(cached.statistics);
      }
    },
    [
      setInjuries,
      setNationalCallups,
      setPlayerRegistrations,
      setTransfers,
      setStatistics,
    ],
  );

  // id変更, season変更両方で読み込む
  const readDatas = useCallback(
    async (playerId: string): Promise<Partial<PlayerSummaryCache>> => {
      const [injury, nationalCallup, playerRegistration, transfer, statistics] =
        await Promise.all([
          readinjuries(playerId),
          readNationalCallups(playerId),
          readPlayerRegistrations(playerId),
          readTransfers(playerId),
          readStatistics(playerId),
        ]);

      return {
        ...(injury && { injury }),
        ...(nationalCallup && { nationalCallup }),
        ...(playerRegistration && { playerRegistration }),
        ...(transfer && { transfer }),
        ...(statistics && { statistics }),
      };
    },
    [
      selected?._id,
      readinjuries,
      readNationalCallups,
      readPlayerRegistrations,
      readTransfers,
      readStatistics,
    ],
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

  const reloadAndCache = async <K extends keyof PlayerSummaryCache>(
    key: K,
    read: () => Promise<PlayerSummaryCache[K] | null | undefined>,
  ) => {
    const id = loadedPlaeyrId;
    if (!id) return;

    const result = await read();
    if (!result) return;

    if (latestIdRef.current !== id) return;

    saveCache(id, {
      [key]: result,
    } as Partial<PlayerSummaryCache>);
  };

  const value: UsePlayerSummary = {
    id: loadedPlaeyrId,
    isLoading,
    selected,
    activateId,

    tab: {
      selectedTab,
      handleSelect: handleSelectedTab,
    },

    panels: {
      top: {
        key: `${selectedTab}`,
        text: "シーズン別成績",
        items: topItems,
        isLoading: statistics.isLoading,
        reloadFun: () =>
          reloadAndCache("statistics", () => readStatistics(loadedPlaeyrId!)),
      },

      nationalCallup: {
        key: `${selectedTab}`,
        items: nationalCallups.data,
        isLoading: nationalCallups.isLoading,
        reloadFun: () =>
          reloadAndCache("nationalCallup", () =>
            readNationalCallups(loadedPlaeyrId!),
          ),
      },

      position: {
        key: `${selectedTab}`,
        items: positions,
        isLoading: statistics.isLoading,
        reloadFun: () =>
          reloadAndCache("statistics", () => readStatistics(loadedPlaeyrId!)),
      },
      transfer: {
        key: `${selectedTab}`,
        items: transfers.data,
        isLoading: transfers.isLoading,
        reloadFun: () =>
          reloadAndCache("transfer", () => readTransfers(loadedPlaeyrId!)),
      },
      injury: {
        key: `${selectedTab}`,
        items: injuries.data,
        isLoading: injuries.isLoading,
        reloadFun: () =>
          reloadAndCache("injury", () => readinjuries(loadedPlaeyrId!)),
      },
      playerRegistration: {
        key: `${selectedTab}`,
        items: playerRegistrations.data,
        isLoading: playerRegistrations.isLoading,
        reloadFun: () =>
          reloadAndCache("playerRegistration", () =>
            readPlayerRegistrations(loadedPlaeyrId!),
          ),
      },
      statistics: {
        key: `${selectedTab}`,
        items: statistics.data,
        isLoading: statistics.isLoading,
        reloadFun: () =>
          reloadAndCache("statistics", () => readStatistics(loadedPlaeyrId!)),
      },
    },
  };

  return (
    <PlayerSummaryContext.Provider value={value}>
      {children}
    </PlayerSummaryContext.Provider>
  );
};

export const usePlayerSummary = () => {
  const context = useContext(PlayerSummaryContext);

  if (!context) {
    throw new Error(
      "usePlayerSummary must be used within PlayerSummaryProvider",
    );
  }

  return context;
};
