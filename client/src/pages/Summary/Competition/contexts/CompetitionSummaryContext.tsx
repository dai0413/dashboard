import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  COMPETITION_TAB,
  CompetitionSummaryCache,
  CompetitionTab,
  GoalStats,
  UseCompetitionSummary,
} from "../types";
import { useCompetition } from "../../../../context/models/competition";
import {
  useCompetitionStagePanel,
  useMatchPanel,
  usePlayerRegistrationPanel,
  usePlayerStatistics,
  useSeasonPanel,
  useSelectOption,
  useStaffRegistrationPanel,
  useStatsLPanel,
  useTeamCompetitionSeasonPanel,
} from "../hooks";
import { getGoalStats } from "../../../../utils/data/getGoalStats";
import { SeasonGet } from "../../../../types/models/season";
import { useCompetitionSummaryCache } from "../hooks/useCompetitionSummaryCache";

const CompetitionSummaryContext = createContext<UseCompetitionSummary | null>(
  null,
);

type Props = {
  children: React.ReactNode;
};

const DEFAULT_TAB = COMPETITION_TAB.TEAM_COMPETITION_SEASON;

export const CompetitionSummaryProvider = ({ children }: Props) => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = useCompetition();

  const [selectedTab, setSelectedTab] = useState<CompetitionTab>(DEFAULT_TAB);

  const [loadedCompetitionId, setLoadedCompetitionId] = useState<string | null>(
    null,
  );

  const { getCache, saveCache, isCacheComplete } = useCompetitionSummaryCache();

  const handleSelectedTab = useCallback(
    (value: string | number | Date | undefined) => {
      const tab = value as CompetitionTab;
      setSelectedTab(tab);

      if (loadedCompetitionId) {
        saveCache(loadedCompetitionId, { selectedTab: tab });
      }
    },
    [loadedCompetitionId, saveCache],
  );

  const { selectedSeason, setSelectedSeason } = useSelectOption();
  const { competitionStages, readCompetitionStages, setCompetitionStages } =
    useCompetitionStagePanel();
  const {
    teamCompetitionSeasons,
    readTeamCompetitionSeasons,
    setTeamCompetitionSeasons,
  } = useTeamCompetitionSeasonPanel();
  const { matches, readMatches, setMatches } = useMatchPanel();
  const {
    playerRegistrations,
    readPlayerRegistrations,
    setPlayerRegistrations,
  } = usePlayerRegistrationPanel();
  const { staffRegistrations, readStaffRegistrations, setStaffRegistrations } =
    useStaffRegistrationPanel();

  const { statsL, readStatsL, setStatsL } = useStatsLPanel();
  const { season, readSeason, seasonOptions, setSeason } = useSeasonPanel();
  const { playerStatistics, readPlayerStatistics, setPlayerStatistics } =
    usePlayerStatistics();

  const goalStats: GoalStats[] = useMemo(() => {
    const data = getGoalStats(matches.data);
    return data;
  }, [matches.data]);

  const restoreCache = useCallback(
    (cached: Partial<CompetitionSummaryCache>) => {
      if (cached.selectedSeason !== undefined) {
        setSelectedSeason(cached.selectedSeason);
      }

      if (cached.match !== undefined) {
        setMatches(cached.match);
      }

      if (cached.season !== undefined) {
        setSeason(cached.season);
      }

      if (cached.competitionStage !== undefined) {
        setCompetitionStages(cached.competitionStage);
      }

      if (cached.teamCompetitionSeason !== undefined) {
        setTeamCompetitionSeasons(cached.teamCompetitionSeason);
      }

      if (cached.playerRegistration !== undefined) {
        setPlayerRegistrations(cached.playerRegistration);
      }

      if (cached.staffRegistration !== undefined) {
        setStaffRegistrations(cached.staffRegistration);
      }

      if (cached.playerStatistic !== undefined) {
        setPlayerStatistics(cached.playerStatistic);
      }

      if (cached.statsL !== undefined) {
        setStatsL(cached.statsL);
      }
    },
    [
      setSelectedSeason,
      setMatches,
      setSeason,
      setCompetitionStages,
      setTeamCompetitionSeasons,
      setPlayerRegistrations,
      setStaffRegistrations,
      setPlayerStatistics,
      setStatsL,
    ],
  );

  // id変更, season変更両方で読み込む
  const readDatas = useCallback(
    async (
      competitionId: string,
      selectedSeason: SeasonGet | null,
    ): Promise<Partial<CompetitionSummaryCache>> => {
      const [
        competitionStage,
        teamCompetitionSeason,
        playerRegistration,
        staffRegistration,
        playerStatistic,
        match,
      ] = await Promise.all([
        readCompetitionStages(competitionId, selectedSeason?._id),
        readTeamCompetitionSeasons(competitionId, selectedSeason?._id),
        readPlayerRegistrations(selectedSeason?._id),
        readStaffRegistrations(selectedSeason?._id),
        readPlayerStatistics(selectedSeason?._id),
        readMatches(selectedSeason?._id),
      ]);

      const statsL = match
        ? await readStatsL(getGoalStats(match.data), selectedSeason?._id)
        : null;

      return {
        ...(match && { match }),
        ...(competitionStage && { competitionStage }),
        ...(teamCompetitionSeason && { teamCompetitionSeason }),
        ...(playerRegistration && { playerRegistration }),
        ...(staffRegistration && { staffRegistration }),
        ...(playerStatistic && { playerStatistic }),
        ...(statsL && { statsL }),
        selectedSeason,
      };
    },
    [selected?._id, readItem, readSeason],
  );

  // season選択で読み込む
  const handleSetSelectedSeason = useCallback(
    async (seasonId: string | number | Date | undefined) => {
      const newSelectedSeason =
        season.data.find((s) => s._id === seasonId) ?? null;

      setSelectedSeason(newSelectedSeason);
      selectedSeasonIdRef.current = newSelectedSeason?._id;

      const id = loadedCompetitionId;

      if (!newSelectedSeason || !id) return;

      const result = await readDatas(id, newSelectedSeason);

      if (latestIdRef.current !== id) return;
      if (selectedSeasonIdRef.current !== newSelectedSeason._id) return;

      saveCache(id, result);
    },
    [season.data, loadedCompetitionId, readDatas],
  );

  const latestIdRef = useRef<string | null>(null);

  const fetchCompetitionData = useCallback(
    async (id: string) => {
      setLoadedCompetitionId(null); // 読み込み中は「未確定」にする
      const isStale = () => latestIdRef.current !== id;

      if (selected?._id !== id) {
        await readItem(id);
        if (isStale()) return;
      }

      const newSeasons = await readSeason(id);
      if (isStale()) return;
      if (!newSeasons?.data.length) return;

      const current = newSeasons.data.find((s) => s.current);
      const newSelectedSeason = current ?? newSeasons.data[0];

      setSeason(newSeasons);
      setSelectedSeason(newSelectedSeason);

      const result = await readDatas(id, newSelectedSeason);
      const selectedTab = getCache(id)?.selectedTab ?? DEFAULT_TAB;
      const cache = {
        ...result,
        season: newSeasons,
        selectedTab,
      };
      saveCache(id, cache);

      if (isStale()) return;

      setLoadedCompetitionId(id);
    },
    [selected?._id, readItem, readSeason, readDatas, saveCache],
  );

  const activateId = useCallback(
    async (id: string) => {
      latestIdRef.current = id;

      if (loadedCompetitionId === id) {
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
        setLoadedCompetitionId(id);
        return;
      }

      await fetchCompetitionData(id);
    },
    [
      loadedCompetitionId,
      selected?._id,
      getCache,
      isCacheComplete,
      readItem,
      restoreCache,
      fetchCompetitionData,
    ],
  );

  const selectedSeasonIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    selectedSeasonIdRef.current = selectedSeason?._id;
  }, [selectedSeason?._id]);

  const reloadAndCache = async <K extends keyof CompetitionSummaryCache>(
    key: K,
    read: () => Promise<CompetitionSummaryCache[K] | null | undefined>,
  ) => {
    const id = loadedCompetitionId;
    const seasonId = selectedSeasonIdRef.current;
    if (!id) return;

    const result = await read();
    if (!result) return;

    // 読み込み中に大会やシーズンが切り替わっていたら保存しない
    if (latestIdRef.current !== id) return;
    if (selectedSeasonIdRef.current !== seasonId) return;

    saveCache(id, { [key]: result } as Partial<CompetitionSummaryCache>);
  };

  const value: UseCompetitionSummary = {
    id: loadedCompetitionId,
    isLoading,
    selected,
    activateId,

    select: {
      selectedOption: selectedSeason,
      options: seasonOptions,
      handleSelect: handleSetSelectedSeason,
    },

    tab: {
      selectedTab,
      handleSelect: handleSelectedTab,
    },

    panels: {
      competitionStage: {
        key: `${selectedTab}-${selectedSeason?._id}`,
        isLoading: competitionStages.isLoading,
        items: competitionStages.data,
        reloadFun: () =>
          reloadAndCache("competitionStage", () =>
            readCompetitionStages(loadedCompetitionId!, selectedSeason?._id),
          ),
      },

      teamCompetitionSeason: {
        key: `${selectedTab}-${selectedSeason?._id}`,
        isLoading: teamCompetitionSeasons.isLoading,
        items: teamCompetitionSeasons.data,
        reloadFun: () =>
          reloadAndCache("teamCompetitionSeason", () =>
            readTeamCompetitionSeasons(
              loadedCompetitionId!,
              selectedSeason?._id,
            ),
          ),
      },

      match: {
        key: `${selectedTab}-${selectedSeason?._id}`,
        isLoading: matches ? matches.isLoading : false,
        items: matches ? matches.data : [],
        reloadFun: async () => {
          const id = loadedCompetitionId;
          const seasonId = selectedSeason?._id;
          if (!id) return;

          const match = await readMatches(seasonId);
          if (!match) return;
          const newStatsL = await readStatsL(
            getGoalStats(match.data),
            seasonId,
          );

          if (latestIdRef.current !== id) return;
          if (selectedSeasonIdRef.current !== seasonId) return;

          saveCache(id, { match, ...(newStatsL && { statsL: newStatsL }) });
        },
      },

      playerRegistration: {
        key: `${selectedTab}-${selectedSeason?._id}`,
        isLoading: playerRegistrations.isLoading,
        items: playerRegistrations.data,
        reloadFun: () =>
          reloadAndCache("playerRegistration", () =>
            readPlayerRegistrations(selectedSeason?._id),
          ),
      },

      staffRegistration: {
        key: `${selectedTab}-${selectedSeason?._id}`,
        isLoading: staffRegistrations.isLoading,
        items: staffRegistrations.data,
        reloadFun: () =>
          reloadAndCache("staffRegistration", () =>
            readStaffRegistrations(selectedSeason?._id),
          ),
      },

      season: {
        key: `${selectedTab}-${loadedCompetitionId}`,
        isLoading: season.isLoading,
        items: season.data,
        reloadFun: () =>
          reloadAndCache("season", () => readSeason(loadedCompetitionId!)),
      },

      statsL: {
        key: `${selectedTab}-${selectedSeason?._id}`,
        text: `${selectedSeason?.name}のスタッツ`,
        items: statsL.items,
        reloadFun: () =>
          reloadAndCache("statsL", () =>
            readStatsL(goalStats, selectedSeason?._id),
          ),
        isLoading: statsL.isLoading,
      },

      playerStatistics: {
        key: `${selectedTab}-${selectedSeason?._id}`,
        items: playerStatistics.data,
        isLoading: playerStatistics.isLoading,
        reloadFun: () =>
          reloadAndCache("playerStatistic", () =>
            readPlayerStatistics(selectedSeason?._id),
          ),
      },
    },
  };

  return (
    <CompetitionSummaryContext.Provider value={value}>
      {children}
    </CompetitionSummaryContext.Provider>
  );
};

export const useCompetitionSummary = () => {
  const context = useContext(CompetitionSummaryContext);

  if (!context) {
    throw new Error(
      "useCompetitionSummary must be used within CompetitionSummaryProvider",
    );
  }

  return context;
};
