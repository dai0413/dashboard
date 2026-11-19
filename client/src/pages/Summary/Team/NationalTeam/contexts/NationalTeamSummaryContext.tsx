import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  NATIONAL_TEAM_TAB,
  NationalTeamSummaryCache,
  NationalTeamTab,
  UseNationalTeamSummary,
} from "../types";
import {
  useMatchPanel,
  usePlayerPanel,
  useSeriesPanel,
  usePlayerPlotPanel,
  useFormationPlotPanel,
} from "../hooks";
import { useNationalTeamSummaryCache } from "../hooks/useNationalTeamSummaryCache";
import { useTeam } from "../../../../../context/models/team";

const NationalTeamSummaryContext = createContext<UseNationalTeamSummary | null>(
  null,
);

type Props = {
  children: React.ReactNode;
};

const DEFAULT_TAB = NATIONAL_TEAM_TAB.SERIES;

export const NationalTeamSummaryProvider = ({ children }: Props) => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = useTeam();

  const [selectedTab, setSelectedTab] = useState<NationalTeamTab>(DEFAULT_TAB);

  const [loadedNationalTeamId, setLoadedNationalTeamId] = useState<
    string | null
  >(null);

  const { getCache, saveCache, isCacheComplete } =
    useNationalTeamSummaryCache();

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as NationalTeamTab);
  };

  const { matches, readMatches, setMatches } = useMatchPanel();
  const { players, readPlayers, setPlayers } = usePlayerPanel();
  const seriesPanel = useSeriesPanel();
  const playerPlotPanel = usePlayerPlotPanel();
  const formationPlotPanel = useFormationPlotPanel();

  const restoreCache = useCallback(
    (cached: Partial<NationalTeamSummaryCache>) => {
      if (cached.match !== undefined) {
        setMatches(cached.match);
      }

      if (cached.player !== undefined) {
        setPlayers(cached.player);
      }

      if (cached.series !== undefined) {
        seriesPanel.restore(cached.series);
      }

      if (cached.playerPlot !== undefined) {
        playerPlotPanel.restore(cached.playerPlot);
      }

      if (cached.formationPlot !== undefined) {
        formationPlotPanel.restore(cached.formationPlot);
      }
    },
    [
      setMatches,
      setPlayers,
      seriesPanel.restore,
      playerPlotPanel.restore,
      formationPlotPanel.restore,
    ],
  );

  // id変更, season変更両方で読み込む
  const readDatas = useCallback(
    async (teamId: string): Promise<Partial<NationalTeamSummaryCache>> => {
      const [match, player, series, playerPlot, formationPlot] =
        await Promise.all([
          readMatches(teamId),
          readPlayers(teamId),
          seriesPanel.readItems(teamId),
          playerPlotPanel.readPlayerPlot(teamId),
          formationPlotPanel.readFormationPlot(teamId),
        ]);

      return {
        ...(match && { match }),
        ...(player && { player }),
        ...(series && { series }),
        ...(playerPlot && { playerPlot }),
        ...(formationPlot && { formationPlot }),
      };
    },
    [selected?._id, readMatches, readPlayers],
  );

  const latestIdRef = useRef<string | null>(null);

  const fetchNationalTeamData = useCallback(
    async (id: string) => {
      setLoadedNationalTeamId(null); // 読み込み中は「未確定」にする
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
      setLoadedNationalTeamId(id);
    },
    [selected?._id, readItem, readDatas, saveCache],
  );

  const activateId = useCallback(
    async (id: string) => {
      latestIdRef.current = id;

      if (loadedNationalTeamId === id) {
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
        setLoadedNationalTeamId(id);
        return;
      }

      await fetchNationalTeamData(id);
    },
    [
      loadedNationalTeamId,
      selected?._id,
      getCache,
      isCacheComplete,
      readItem,
      restoreCache,
      fetchNationalTeamData,
    ],
  );

  const reloadAndCache = async <
    K extends keyof NationalTeamSummaryCache,
    Args extends unknown[],
  >(
    key: K,
    read: (
      ...args: Args
    ) => Promise<NationalTeamSummaryCache[K] | null | undefined>,
    ...args: Args
  ) => {
    const id = loadedNationalTeamId;
    if (!id) return;

    const result = await read(...args);
    if (!result) return;

    if (latestIdRef.current !== id) return;

    saveCache(id, {
      [key]: result,
    } as Partial<NationalTeamSummaryCache>);
  };

  const value: UseNationalTeamSummary = {
    id: loadedNationalTeamId,
    isLoading,
    selected,
    activateId,

    tab: {
      selectedTab,
      handleSelect: handleSelectedTab,
    },

    panels: {
      player: {
        text: `${selected?.normalized_name || selected?.abbr}に招集された選手`,
        isLoading: players.isLoading,
        key: `${selectedTab}`,
        items: players.data,
        reloadFun: () =>
          reloadAndCache("player", () => readPlayers(loadedNationalTeamId!)),
      },

      match: {
        text: `${selected?.normalized_name || selected?.abbr}の試合`,
        isLoading: matches.isLoading,
        key: `${selectedTab}`,
        items: matches.data,
        reloadFun: () =>
          reloadAndCache("match", () => readMatches(loadedNationalTeamId!)),
      },

      series: {
        text: `${selected?.normalized_name || selected?.abbr}の試合シリーズ`,
        isLoading: seriesPanel.isLoading,
        key: `${selectedTab}`,
        items: seriesPanel.items,
        reloadFun: () =>
          reloadAndCache("series", () =>
            seriesPanel.readItems(loadedNationalTeamId!),
          ),
      },

      playerPlot: {
        key: `${selectedTab}`,
        text: `${selected?.normalized_name || selected?.abbr}に招集された選手`,
        isLoading: playerPlotPanel.isLoading,
        items: playerPlotPanel.items,
        reloadFun: (filterConditions, sortConditions) =>
          reloadAndCache(
            "playerPlot",
            (filter, sort) =>
              playerPlotPanel.readPlayerPlot(
                loadedNationalTeamId!,
                filter,
                sort,
              ),
            filterConditions,
            sortConditions,
          ),
      },

      formationPlot: {
        key: `${selectedTab}`,
        text: `${selected?.normalized_name || selected?.abbr}に招集された選手`,
        isLoading: formationPlotPanel.formationPlotIsLoading,
        items: formationPlotPanel.items,
        reloadFun: (filterConditions, sortConditions) =>
          reloadAndCache(
            "formationPlot",
            (filter, sort) =>
              formationPlotPanel.readFormationPlot(
                loadedNationalTeamId!,
                filter,
                sort,
              ),
            filterConditions,
            sortConditions,
          ),
      },
    },
  };

  return (
    <NationalTeamSummaryContext.Provider value={value}>
      {children}
    </NationalTeamSummaryContext.Provider>
  );
};

export const useNationalTeamSummary = () => {
  const context = useContext(NationalTeamSummaryContext);

  if (!context) {
    throw new Error(
      "useNationalTeamSummary must be used within NationalTeamSummaryProvider",
    );
  }

  return context;
};
