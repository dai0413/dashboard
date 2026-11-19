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

  const [loadedPlayerId, setLoadedPlayerId] = useState<string | null>(null);

  const { getCache, saveCache, isCacheComplete } = usePlayerSummaryCache();

  const handleSelectedTab = useCallback(
    (value: string | number | Date | undefined) => {
      const tab = value as PlayerTab;
      setSelectedTab(tab);

      if (loadedPlayerId) {
        saveCache(loadedPlayerId, { selectedTab: tab });
      }
    },
    [loadedPlayerId, saveCache],
  );

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

      if (cached.selectedTab !== undefined) {
        setSelectedTab(cached.selectedTab);
      }
    },
    [
      setInjuries,
      setNationalCallups,
      setPlayerRegistrations,
      setTransfers,
      setStatistics,
      setSelectedTab,
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

  const fetchPlayerData = useCallback(
    async (id: string) => {
      setLoadedPlayerId(null); // 読み込み中は「未確定」にする
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

      setLoadedPlayerId(id);
    },
    [selected?._id, readItem, readDatas, saveCache, getCache],
  );

  const activateId = useCallback(
    async (id: string) => {
      latestIdRef.current = id;

      if (loadedPlayerId === id) {
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
        setLoadedPlayerId(id);
        return;
      }

      await fetchPlayerData(id);
    },
    [
      loadedPlayerId,
      selected?._id,
      getCache,
      isCacheComplete,
      readItem,
      restoreCache,
      fetchPlayerData,
    ],
  );

  const reloadAndCache = async <K extends keyof PlayerSummaryCache>(
    key: K,
    read: () => Promise<PlayerSummaryCache[K] | null | undefined>,
  ) => {
    const id = loadedPlayerId;
    if (!id) return;

    const result = await read();
    if (!result) return;

    if (latestIdRef.current !== id) return;

    saveCache(id, {
      [key]: result,
    } as Partial<PlayerSummaryCache>);
  };

  const value: UsePlayerSummary = {
    id: loadedPlayerId,
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
          reloadAndCache("statistics", () => readStatistics(loadedPlayerId!)),
      },

      nationalCallup: {
        key: `${selectedTab}`,
        items: nationalCallups.data,
        isLoading: nationalCallups.isLoading,
        reloadFun: () =>
          reloadAndCache("nationalCallup", () =>
            readNationalCallups(loadedPlayerId!),
          ),
      },

      position: {
        key: `${selectedTab}`,
        items: positions,
        isLoading: statistics.isLoading,
        reloadFun: () =>
          reloadAndCache("statistics", () => readStatistics(loadedPlayerId!)),
      },
      transfer: {
        key: `${selectedTab}`,
        items: transfers.data,
        isLoading: transfers.isLoading,
        reloadFun: () =>
          reloadAndCache("transfer", () => readTransfers(loadedPlayerId!)),
      },
      injury: {
        key: `${selectedTab}`,
        items: injuries.data,
        isLoading: injuries.isLoading,
        reloadFun: () =>
          reloadAndCache("injury", () => readinjuries(loadedPlayerId!)),
      },
      playerRegistration: {
        key: `${selectedTab}`,
        items: playerRegistrations.data,
        isLoading: playerRegistrations.isLoading,
        reloadFun: () =>
          reloadAndCache("playerRegistration", () =>
            readPlayerRegistrations(loadedPlayerId!),
          ),
      },
      statistics: {
        key: `${selectedTab}`,
        items: statistics.data,
        isLoading: statistics.isLoading,
        reloadFun: () =>
          reloadAndCache("statistics", () => readStatistics(loadedPlayerId!)),
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
