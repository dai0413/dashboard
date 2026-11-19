import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  NATIONAL_TAB,
  NationalSummaryCache,
  NationalTab,
  UseNationalSummary,
} from "../types";
import { useCountry } from "../../../../context/models/country";
import { useCompetitionPanel, useSeriesPanel, useTeamPanel } from "../hooks";
import { useNationalSummaryCache } from "../hooks/useNationalSummaryCache";

const NationalSummaryContext = createContext<UseNationalSummary | null>(null);

type Props = {
  children: React.ReactNode;
};

const DEFAULT_TAB = NATIONAL_TAB.COMPETITION;

export const NationalSummaryProvider = ({ children }: Props) => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = useCountry();

  const [selectedTab, setSelectedTab] = useState<NationalTab>(DEFAULT_TAB);

  const [loadedNationalId, setLoadedNationalId] = useState<string | null>(null);

  const { getCache, saveCache, isCacheComplete } = useNationalSummaryCache();

  const handleSelectedTab = useCallback(
    (value: string | number | Date | undefined) => {
      const tab = value as NationalTab;
      setSelectedTab(tab);

      if (loadedNationalId) {
        saveCache(loadedNationalId, { selectedTab: tab });
      }
    },
    [loadedNationalId, saveCache],
  );

  const { teams, readTeams, setTeams } = useTeamPanel();
  const { competitions, readCompetitions, setCompetitions } =
    useCompetitionPanel();
  const { seriesData, readSeriesData, restoreSeries, reloadSeries } =
    useSeriesPanel();

  const restoreCache = useCallback(
    (cached: Partial<NationalSummaryCache>) => {
      if (cached.competition !== undefined) {
        setCompetitions(cached.competition);
      }

      if (cached.team !== undefined) {
        setTeams(cached.team);
      }

      if (cached.nationalMatchSeries !== undefined) {
        restoreSeries(cached.nationalMatchSeries);
      }
    },
    [setTeams, setCompetitions, restoreSeries],
  );

  // id変更, season変更両方で読み込む
  const readDatas = useCallback(
    async (countryId: string): Promise<Partial<NationalSummaryCache>> => {
      const [team, competition] = await Promise.all([
        readTeams(countryId),
        readCompetitions(countryId),
      ]);

      const teamIds = team?.data.map((t) => t._id);

      const nationalMatchSeries =
        teamIds && teamIds.length > 0 ? await readSeriesData(teamIds) : null;

      return {
        ...(team && { team }),
        ...(competition && { competition }),
        ...(nationalMatchSeries && { nationalMatchSeries }),
      };
    },
    [readTeams, readCompetitions, readSeriesData],
  );

  const latestIdRef = useRef<string | null>(null);

  const fetchNationalData = useCallback(
    async (id: string) => {
      setLoadedNationalId(null); // 読み込み中は「未確定」にする
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
      setLoadedNationalId(id);
    },
    [selected?._id, readItem, readDatas, saveCache, getCache],
  );

  const activateId = useCallback(
    async (id: string) => {
      latestIdRef.current = id;

      if (loadedNationalId === id) {
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
        setLoadedNationalId(id);
        return;
      }

      await fetchNationalData(id);
    },
    [
      loadedNationalId,
      selected?._id,
      getCache,
      isCacheComplete,
      readItem,
      restoreCache,
      fetchNationalData,
    ],
  );

  const reloadAndCache = async <K extends keyof NationalSummaryCache>(
    key: K,
    read: () => Promise<NationalSummaryCache[K] | null | undefined>,
  ) => {
    const id = loadedNationalId;
    if (!id) return;

    const result = await read();
    if (!result) return;

    if (latestIdRef.current !== id) return;

    saveCache(id, { [key]: result } as Partial<NationalSummaryCache>);
  };

  const value: UseNationalSummary = {
    id: loadedNationalId,
    isLoading,
    selected,
    activateId,

    tab: {
      selectedTab,
      handleSelect: handleSelectedTab,
    },

    panels: {
      competition: {
        key: `${selectedTab}`,
        isLoading: competitions.isLoading,
        items: competitions.data,
        reloadFun: () =>
          reloadAndCache("competition", () =>
            readCompetitions(loadedNationalId!),
          ),
      },

      team: {
        key: `${selectedTab}`,
        isLoading: teams.isLoading,
        items: teams.data,
        reloadFun: () =>
          reloadAndCache("team", () => readTeams(loadedNationalId!)),
      },

      nationalMatchSeries: {
        key: `${selectedTab}`,
        isLoading: seriesData.isLoading,
        items: seriesData,
        reloadFun: () =>
          reloadAndCache("nationalMatchSeries", () =>
            reloadSeries(teams.data.map((t) => t._id)),
          ),
      },
    },
  };

  return (
    <NationalSummaryContext.Provider value={value}>
      {children}
    </NationalSummaryContext.Provider>
  );
};

export const useNationalSummary = () => {
  const context = useContext(NationalSummaryContext);

  if (!context) {
    throw new Error(
      "useNationalSummary must be used within NationalSummaryProvider",
    );
  }

  return context;
};
