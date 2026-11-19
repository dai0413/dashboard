import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MATCH_TAB,
  MatchSummaryCache,
  MatchTab,
  UseMatchSummary,
} from "../types";
import {
  useAwayStatsLPanel,
  useAwaySubMemberPanel,
  useHomeStatsLPanel,
  useHomeSubMemberPanel,
  usePlayerMatchEventLogPanel,
  useRefereeAppearancePanel,
  useStaffAppearancePanel,
  useStaffMatchEventLogPanel,
  useStartingMemberPanel,
  useTeamMatchFormationPanel,
} from "../hooks";
import { useMatchSummaryCache } from "../hooks/useMatchSummaryCache";
import { useMatch } from "../../../../context/models/match";

const MatchSummaryContext = createContext<UseMatchSummary | null>(null);

type Props = {
  children: React.ReactNode;
};

const DEFAULT_TAB = MATCH_TAB.HOME_STARTING_MEMBER;

export const MatchSummaryProvider = ({ children }: Props) => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = useMatch();

  const [selectedTab, setSelectedTab] = useState<MatchTab>(DEFAULT_TAB);

  const [loadedMatchId, setLoadedMatchId] = useState<string | null>(null);

  const { getCache, saveCache, isCacheComplete } = useMatchSummaryCache();

  const handleSelectedTab = useCallback(
    (value: string | number | Date | undefined) => {
      const tab = value as MatchTab;
      setSelectedTab(tab);

      if (loadedMatchId) {
        saveCache(loadedMatchId, { selectedTab: tab });
      }
    },
    [loadedMatchId, saveCache],
  );

  const { awayStatsL, readAwayStatsL, setAwayStatsL } = useAwayStatsLPanel();
  const { awaySubMembers, readAwaySubMembers, setAwaySubMembers } =
    useAwaySubMemberPanel();
  const { homeStatsL, readHomeStatsL, setHomeStatsL } = useHomeStatsLPanel();
  const { homeSubMembers, readHomeSubMembers, setHomeSubMembers } =
    useHomeSubMemberPanel();
  const {
    playerMatchEventLogs,
    readPlayerMatchEventLogs,
    setPlayerMatchEventLogs,
  } = usePlayerMatchEventLogPanel();
  const { refereeAppearances, readRefereeAppearances, setRefereeAppearances } =
    useRefereeAppearancePanel();
  const { staffAppearances, readStaffAppearances, setStaffAppearances } =
    useStaffAppearancePanel();
  const {
    staffMatchEventLogs,
    readStaffMatchEventLogs,
    setStaffMatchEventLogs,
  } = useStaffMatchEventLogPanel();
  const { startingMembers, readStartingMembers, setStartingMembers } =
    useStartingMemberPanel();
  const {
    teamMatchFormations,
    readTeamMatchFormations,
    setTeamMatchFormations,
  } = useTeamMatchFormationPanel();

  const restoreCache = useCallback(
    (cached: Partial<MatchSummaryCache>) => {
      if (cached.awayStatsL !== undefined) {
        setAwayStatsL(cached.awayStatsL);
      }

      if (cached.awaySubMember !== undefined) {
        setAwaySubMembers(cached.awaySubMember);
      }

      if (cached.homeStatsL !== undefined) {
        setHomeStatsL(cached.homeStatsL);
      }

      if (cached.homeSubMember !== undefined) {
        setHomeSubMembers(cached.homeSubMember);
      }

      if (cached.playerMatchEventLog !== undefined) {
        setPlayerMatchEventLogs(cached.playerMatchEventLog);
      }

      if (cached.refereeAppearance !== undefined) {
        setRefereeAppearances(cached.refereeAppearance);
      }

      if (cached.staffAppearance !== undefined) {
        setStaffAppearances(cached.staffAppearance);
      }

      if (cached.staffMatchEventLog !== undefined) {
        setStaffMatchEventLogs(cached.staffMatchEventLog);
      }

      if (cached.startingMember !== undefined) {
        setStartingMembers(cached.startingMember);
      }

      if (cached.teamMatchFormation !== undefined) {
        setTeamMatchFormations(cached.teamMatchFormation);
      }
    },
    [
      setAwayStatsL,
      setAwaySubMembers,
      setHomeStatsL,
      setHomeSubMembers,
      setPlayerMatchEventLogs,
      setRefereeAppearances,
      setStaffAppearances,
      setStaffMatchEventLogs,
      setStartingMembers,
      setTeamMatchFormations,
    ],
  );

  // id変更, season変更両方で読み込む
  const readDatas = useCallback(
    async (
      matchId: string,
      homeTeamId: string,
      awayTeamId: string,
    ): Promise<Partial<MatchSummaryCache>> => {
      const [
        awayStatsL,
        awaySubMembers,
        homeStatsL,
        homeSubMembers,
        playerMatchEventLogs,
        refereeAppearances,
        staffAppearances,
        staffMatchEventLogs,
        startingMembers,
        teamMatchFormations,
      ] = await Promise.all([
        readAwayStatsL(matchId, awayTeamId),
        readAwaySubMembers(matchId, awayTeamId),
        readHomeStatsL(matchId, homeTeamId),
        readHomeSubMembers(matchId, homeTeamId),
        readPlayerMatchEventLogs(matchId, homeTeamId, awayTeamId),
        readRefereeAppearances(matchId),
        readStaffAppearances(matchId, homeTeamId, awayTeamId),
        readStaffMatchEventLogs(matchId, homeTeamId, awayTeamId),
        readStartingMembers(matchId, homeTeamId, awayTeamId),
        readTeamMatchFormations(matchId, homeTeamId, awayTeamId),
      ]);

      return {
        ...(awayStatsL && { awayStatsL }),
        ...(awaySubMembers && { awaySubMembers }),
        ...(homeStatsL && { homeStatsL }),
        ...(homeSubMembers && { homeSubMembers }),
        ...(playerMatchEventLogs && { playerMatchEventLogs }),
        ...(refereeAppearances && { refereeAppearances }),
        ...(staffAppearances && { staffAppearances }),
        ...(staffMatchEventLogs && { staffMatchEventLogs }),
        ...(startingMembers && { startingMembers }),
        ...(teamMatchFormations && { teamMatchFormations }),
      };
    },
    [selected?._id, readItem, saveCache],
  );

  const latestIdRef = useRef<string | null>(null);
  const homeTeamId = useMemo(
    () => selected?.home_team.id,
    [selected, selected?.home_team.id],
  );
  const awayTeamId = useMemo(
    () => selected?.away_team.id,
    [selected, selected?.away_team.id],
  );

  const fetchMatchData = useCallback(
    async (matchId: string, homeTeamId: string, awayTeamId: string) => {
      setLoadedMatchId(null); // 読み込み中は「未確定」にする
      const isStale = () => latestIdRef.current !== matchId;

      if (selected?._id !== matchId) {
        await readItem(matchId);
        if (isStale()) return;
      }

      if (!homeTeamId || !awayTeamId) return;

      const result = await readDatas(matchId, homeTeamId, awayTeamId);
      const selectedTab = getCache(matchId)?.selectedTab ?? DEFAULT_TAB;
      const cache = {
        ...result,
        selectedTab,
      };

      saveCache(matchId, cache);

      if (isStale()) return;
      setLoadedMatchId(matchId);
    },
    [selected?._id, readItem, readDatas, saveCache, getCache],
  );

  const activateId = useCallback(
    async (id: string) => {
      latestIdRef.current = id;

      if (loadedMatchId === id) {
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
        setLoadedMatchId(id);
        return;
      }

      // 対象のMatchを取得
      const match = selected?._id === id ? selected : await readItem(id);

      if (latestIdRef.current !== id) return;

      const homeTeamId = match?.home_team.id;
      const awayTeamId = match?.away_team.id;

      if (!homeTeamId || !awayTeamId) return;

      await fetchMatchData(id, homeTeamId, awayTeamId);
    },
    [
      loadedMatchId,
      selected?._id,
      getCache,
      isCacheComplete,
      readItem,
      restoreCache,
      fetchMatchData,
    ],
  );

  const reloadAndCache = async <K extends keyof MatchSummaryCache>(
    key: K,
    read: () => Promise<MatchSummaryCache[K] | null | undefined>,
  ) => {
    const id = loadedMatchId;
    if (!id) return;

    const result = await read();
    if (!result) return;

    if (latestIdRef.current !== id) return;

    saveCache(id, { [key]: result } as Partial<MatchSummaryCache>);
  };

  const value: UseMatchSummary = {
    id: loadedMatchId,
    isLoading,
    selected,
    activateId,

    tab: {
      selectedTab,
      handleSelect: handleSelectedTab,
    },

    panels: {
      startingMember: {
        key: `${selectedTab}`,
        isLoading: startingMembers.isLoading,
        items: { home: startingMembers.home, away: startingMembers.away },
        reloadFun: () =>
          reloadAndCache("startingMember", () =>
            readStartingMembers(loadedMatchId!, homeTeamId, awayTeamId),
          ),
      },

      homeSubMember: {
        key: `${selectedTab}`,
        isLoading: homeSubMembers.isLoading,
        items: homeSubMembers.data,
        reloadFun: () =>
          reloadAndCache("homeSubMember", () =>
            readHomeSubMembers(loadedMatchId!, homeTeamId),
          ),
      },

      awaySubMember: {
        key: `${selectedTab}`,
        isLoading: awaySubMembers.isLoading,
        items: awaySubMembers.data,
        reloadFun: () =>
          reloadAndCache("awaySubMember", () =>
            readAwaySubMembers(loadedMatchId!, homeTeamId),
          ),
      },

      staffAppearance: {
        key: `${selectedTab}`,
        isLoading: staffAppearances.isLoading,
        items: staffAppearances.data,
        reloadFun: () =>
          reloadAndCache("staffAppearance", () =>
            readStaffAppearances(loadedMatchId!),
          ),
      },

      playerMatchEventLog: {
        key: `${selectedTab}`,
        isLoading: playerMatchEventLogs.isLoading,
        items: playerMatchEventLogs.data,
        reloadFun: () =>
          reloadAndCache("playerMatchEventLog", () =>
            readPlayerMatchEventLogs(loadedMatchId!),
          ),
      },

      staffMatchEventLog: {
        key: `${selectedTab}`,
        isLoading: staffMatchEventLogs.isLoading,
        items: staffMatchEventLogs.data,
        reloadFun: () =>
          reloadAndCache("staffMatchEventLog", () =>
            readStaffMatchEventLogs(loadedMatchId!),
          ),
      },

      teamMatchFormation: {
        key: `${selectedTab}`,
        isLoading: teamMatchFormations.isLoading,
        items: teamMatchFormations.data,
        reloadFun: () =>
          reloadAndCache("teamMatchFormation", () =>
            readTeamMatchFormations(loadedMatchId!),
          ),
      },

      homeStatsL: {
        key: `${selectedTab}`,
        isLoading: homeStatsL.isLoading,
        items: homeStatsL.data,
        reloadFun: () =>
          reloadAndCache("homeStatsL", () =>
            readHomeStatsL(loadedMatchId!, homeTeamId),
          ),
      },

      awayStatsL: {
        key: `${selectedTab}`,
        isLoading: awayStatsL.isLoading,
        items: awayStatsL.data,
        reloadFun: () =>
          reloadAndCache("awayStatsL", () =>
            readAwayStatsL(loadedMatchId!, awayTeamId),
          ),
      },

      refereeAppearance: {
        key: `${selectedTab}`,
        isLoading: refereeAppearances.isLoading,
        items: refereeAppearances.data,
        reloadFun: () =>
          reloadAndCache("refereeAppearance", () =>
            readRefereeAppearances(loadedMatchId!),
          ),
      },
    },
  };

  return (
    <MatchSummaryContext.Provider value={value}>
      {children}
    </MatchSummaryContext.Provider>
  );
};

export const useMatchSummary = () => {
  const context = useContext(MatchSummaryContext);

  if (!context) {
    throw new Error("useMatchSummary must be used within MatchSummaryProvider");
  }

  return context;
};
