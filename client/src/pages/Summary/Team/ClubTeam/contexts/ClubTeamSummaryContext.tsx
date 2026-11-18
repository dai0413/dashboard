import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CLUB_TEAM_TAB,
  ClubTeamSummaryCache,
  ClubTeamTab,
  UseClubTeamSummary,
} from "../types";
import {
  usePlayerPanel,
  useFutureInPanel,
  useRadarPanel,
  useLinePlotPanel,
  useTransferInPanel,
  useSelectOption,
  useTransferOutPanel,
  useLoanPanel,
  useInjuryPanel,
  useMatchPanel,
  usePlayerRegistrationPanel,
  useTeamCompetitionSeasonPanel,
  useStatsLPanel,
  useStaffRegistrationPanel,
  useAppearancePlotPanel,
  useFormationPlotPanel,
  usePlayerStatisticPanel,
} from "../hooks";
import { useClubTeamSummaryCache } from "../hooks/useClubTeamSummaryCache";
import { useTeam } from "../../../../../context/models/team";
import { SeasonDates } from "../../../../../types/seasonDates";
import { createTopPanelItems } from "../utils/createTopPanelItems";
import { TeamCompetitionSeason } from "../../../../../types/models/team-competition-season";
import { ModelType } from "../../../../../types/models";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { getWindowDates } from "../../../../../utils/date/getWindowDates";

const ClubTeamSummaryContext = createContext<UseClubTeamSummary | null>(null);

type Props = {
  children: React.ReactNode;
};

const DEFAULT_TAB = CLUB_TEAM_TAB.TOP;

export const ClubTeamSummaryProvider = ({ children }: Props) => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = useTeam();

  const [selectedTab, setSelectedTab] = useState<ClubTeamTab>(DEFAULT_TAB);

  const [loadedClubTeamId, setLoadedClubTeamId] = useState<string | null>(null);

  const { getCache, saveCache, isCacheComplete } = useClubTeamSummaryCache();

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as ClubTeamTab);
  };

  const { players, readPlayers, setPlayers } = usePlayerPanel();
  const { futurein, readFutureins, setFuturein } = useFutureInPanel();
  const { transferIns, readTransferIns, setTransferIns } = useTransferInPanel();
  const { transferOuts, readTransferOuts, setTransferOuts } =
    useTransferOutPanel();
  const { loans, readLoans, setLoans } = useLoanPanel();
  const { injuries, readInjuries, setInjuries } = useInjuryPanel();
  const { matches, readMatches, setMatches } = useMatchPanel();
  const {
    playerRegistrations,
    readPlayerRegistrations,
    setPlayerRegistrations,
  } = usePlayerRegistrationPanel();
  const { statsL, readStatsL, setStatsL } = useStatsLPanel();
  const { staffRegistrations, readStaffRegistrations, setStaffRegistrations } =
    useStaffRegistrationPanel();
  const { radarData, readRadarData, setRadarData } = useRadarPanel();
  const { readLinePlotData, linePLotData, setLinePlotData } =
    useLinePlotPanel();
  const {
    selectedteamCompetitionSeason,
    setSelectedTeamCompetitionSeason,
    seasonDates,
    setSeasonDates,
  } = useSelectOption();
  const {
    teamCompetitionSeason,
    readTeamCompetitionSeason,
    seasonOptions,
    setTeamCompetitionSeason,
  } = useTeamCompetitionSeasonPanel();
  const appearancePlotPanel = useAppearancePlotPanel(
    loadedClubTeamId!,
    seasonDates.normalSeason.seasonRange,
  );
  const birthYearPositionMatrixPanel = useAppearancePlotPanel(
    loadedClubTeamId!,
    seasonDates.normalSeason.seasonRange,
  );
  const formationPlotPanel = useFormationPlotPanel(
    loadedClubTeamId!,
    seasonDates.normalSeason.seasonRange,
  );
  const playerStatisticPanel = usePlayerStatisticPanel(
    loadedClubTeamId!,
    seasonDates.normalSeason.seasonRange,
  );

  const topItems = useMemo(
    () => createTopPanelItems(loadedClubTeamId!, matches.data),
    [matches, loadedClubTeamId],
  );

  const restoreCache = useCallback(
    (cached: Partial<ClubTeamSummaryCache>) => {
      if (cached.player !== undefined) {
        setPlayers(cached.player);
      }

      if (cached.future_in !== undefined) {
        setFuturein(cached.future_in);
      }

      if (cached.transfer_in !== undefined) {
        setTransferIns(cached.transfer_in);
      }

      if (cached.transfer_out !== undefined) {
        setTransferOuts(cached.transfer_out);
      }

      if (cached.loan !== undefined) {
        setLoans(cached.loan);
      }

      if (cached.injury !== undefined) {
        setInjuries(cached.injury);
      }

      if (cached.match !== undefined) {
        setMatches(cached.match);
      }

      if (cached.playerRegistration !== undefined) {
        setPlayerRegistrations(cached.playerRegistration);
      }

      if (cached.statsL !== undefined) {
        setStatsL(cached.statsL);
      }

      if (cached.staffRegistration !== undefined) {
        setStaffRegistrations(cached.staffRegistration);
      }

      if (cached.radarData !== undefined) {
        setRadarData(cached.radarData);
      }

      if (cached.linePlot !== undefined) {
        setLinePlotData(cached.linePlot);
      }

      if (cached.seasonDate !== undefined) {
        setSeasonDates(cached.seasonDate);
      }

      if (cached.selectedteamCompetitionSeason !== undefined) {
        setSelectedTeamCompetitionSeason(cached.selectedteamCompetitionSeason);
      }

      if (cached.teamCompetitionSeason !== undefined) {
        setTeamCompetitionSeason(cached.teamCompetitionSeason);
      }

      if (cached.appearancePlot !== undefined) {
        appearancePlotPanel.restore(cached.appearancePlot);
      }

      if (cached.birthYearPositionMatrix !== undefined) {
        birthYearPositionMatrixPanel.restore(cached.birthYearPositionMatrix);
      }

      if (cached.formationPlot !== undefined) {
        formationPlotPanel.restore(cached.formationPlot);
      }

      if (cached.playerStatistics !== undefined) {
        playerStatisticPanel.restore(cached.playerStatistics);
      }
    },
    [
      setPlayers,
      setFuturein,
      setTransferIns,
      setTransferOuts,
      setLoans,
      setInjuries,
      setMatches,
      setPlayerRegistrations,
      setStatsL,
      setStaffRegistrations,
      setRadarData,
      setLinePlotData,
      setSeasonDates,
      setSelectedTeamCompetitionSeason,
      setTeamCompetitionSeason,
      appearancePlotPanel.restore,
      birthYearPositionMatrixPanel.restore,
      formationPlotPanel.restore,
      playerStatisticPanel.restore,
    ],
  );

  // id変更, season変更両方で読み込む
  const readDatas = useCallback(
    async (
      teamId: string,
      seasonDates?: {
        normalSeason: SeasonDates;
        transferWindow: SeasonDates;
        future: SeasonDates;
      },
      seasonId?: string,
    ): Promise<Partial<ClubTeamSummaryCache>> => {
      const newSeasons = await readTeamCompetitionSeason(teamId);

      if (!newSeasons || newSeasons.data.length === 0) return {};

      const seasons: TeamCompetitionSeason[] = newSeasons.data;

      const todaySeason = seasons.find(
        (s: TeamCompetitionSeason) =>
          s.season.start_date &&
          new Date(s.season.start_date) <= new Date() &&
          s.season.end_date &&
          new Date(s.season.end_date) >= new Date(),
      );

      const currentSeason = seasons.find(
        (s: TeamCompetitionSeason) => s.season.current,
      );

      const lastSeason = seasons.reduce(
        (latest, current) => {
          if (!current.season?.start_date || !latest?.season?.start_date) {
            return latest ?? current;
          }

          return new Date(current.season.start_date) >
            new Date(latest.season.start_date)
            ? current
            : latest;
        },
        undefined as TeamCompetitionSeason | undefined,
      );

      const nextSelectedTeamCompetitionSeason =
        todaySeason ?? currentSeason ?? lastSeason;

      let nextSeasonDates = seasonDates;

      if (nextSelectedTeamCompetitionSeason) {
        const nextSeasonRange = convert(
          ModelType.SEASON,
          nextSelectedTeamCompetitionSeason.season,
        );
        nextSeasonDates = getWindowDates(nextSeasonRange);
        setSeasonDates(nextSeasonDates);

        setSelectedTeamCompetitionSeason(nextSelectedTeamCompetitionSeason);
      }

      const nextSeasonId = seasonId
        ? seasonId
        : nextSelectedTeamCompetitionSeason?.season._id;

      if (!nextSeasonId || !nextSeasonDates) return {};

      const [
        player,
        future_in,
        transfer_in,
        transfer_out,
        loan,
        injury,
        match,
        playerRegistration,
        statsL,
        staffRegistration,
        radarData,
        teamCompetitionSeason,
        appearancePlot,
        birthYearPositionMatrix,
        formationPlot,
        linePlot,
        playerStatistics,
      ] = await Promise.all([
        readPlayers(teamId, nextSeasonDates.transferWindow.seasonRange),
        readFutureins(teamId, [
          `>=${nextSeasonDates.future.startDate}`,
          `<=${nextSeasonDates.future.endDate}`,
        ]),
        readTransferIns(teamId, nextSeasonDates.transferWindow.seasonRange),
        readTransferOuts(teamId, nextSeasonDates.transferWindow.seasonRange),
        readLoans(teamId, nextSeasonDates.transferWindow.seasonRange),
        readInjuries(teamId, nextSeasonDates.normalSeason.seasonRange),
        readMatches(teamId, nextSeasonDates.normalSeason.seasonRange),
        readPlayerRegistrations(teamId, nextSeasonId),
        readStatsL(teamId, nextSeasonId),
        readStaffRegistrations(teamId, nextSeasonId),
        readRadarData(teamId, nextSeasonId),
        readTeamCompetitionSeason(teamId),
        appearancePlotPanel.reloadFun(
          [],
          [],
          teamId,
          nextSeasonDates.normalSeason.seasonRange,
        ),
        birthYearPositionMatrixPanel.reloadFun(
          [],
          [],
          teamId,
          nextSeasonDates.normalSeason.seasonRange,
        ),
        formationPlotPanel.reloadFun(
          [],
          [],
          teamId,
          nextSeasonDates.normalSeason.seasonRange,
        ),
        readLinePlotData(teamId, nextSeasonId),

        playerStatisticPanel.reloadFun(
          [],
          [],
          teamId,
          nextSeasonDates.normalSeason.seasonRange,
        ),
      ]);

      return {
        ...(player && { player }),
        ...(future_in && { future_in }),
        ...(transfer_in && { transfer_in }),
        ...(transfer_out && { transfer_out }),
        ...(loan && { loan }),
        ...(injury && { injury }),
        ...(match && { match }),
        ...(playerRegistration && { playerRegistration }),
        ...(statsL && { statsL }),
        ...(staffRegistration && { staffRegistration }),
        ...(radarData && { radarData }),
        ...(teamCompetitionSeason && { teamCompetitionSeason }),
        ...(appearancePlot && { appearancePlot }),
        ...(birthYearPositionMatrix && { birthYearPositionMatrix }),
        ...(formationPlot && { formationPlot }),
        ...(linePlot && { linePlot }),
        ...(playerStatistics && { playerStatistics }),
      };
    },
    [
      selected?._id,
      readPlayers,
      readFutureins,
      readTransferIns,
      readTransferOuts,
      readLoans,
      readInjuries,
      readMatches,
      readPlayerRegistrations,
      readStatsL,
      readStaffRegistrations,
      readRadarData,
      readTeamCompetitionSeason,
      appearancePlotPanel.reloadFun,
      formationPlotPanel.reloadFun,
      readLinePlotData,
      playerStatisticPanel.reloadFun,
    ],
  );

  const latestIdRef = useRef<string | null>(null);

  const fetchClubTeamData = useCallback(
    async (id: string) => {
      setLoadedClubTeamId(null); // 読み込み中は「未確定」にする
      const isStale = () => latestIdRef.current !== id;

      if (selected?._id !== id) {
        await readItem(id);
        if (isStale()) return;
      }

      console.log("isStale", isStale());

      if (isStale()) return;

      const result = await readDatas(id);
      console.log("id", id, result);

      // 取得できたデータは正しいのでキャッシュには残す
      saveCache(id, { ...result });

      if (isStale()) return; // 状態への反映だけやめる
      setLoadedClubTeamId(id);
    },
    [selected?._id, readItem, readDatas, saveCache],
  );

  // season選択で読み込む
  const handleSetSelectedSeason = useCallback(
    (seasonId: string | number | Date | undefined) => {
      const nextSelectedTeamCompetitionSeason =
        teamCompetitionSeason.data.find((s) => s._id === seasonId) ?? null;

      setSelectedTeamCompetitionSeason(nextSelectedTeamCompetitionSeason);

      if (loadedClubTeamId && selected && nextSelectedTeamCompetitionSeason) {
        const newSeason = convert(
          ModelType.SEASON,
          nextSelectedTeamCompetitionSeason.season,
        );

        const newSeasonDates = getWindowDates(newSeason);

        setSeasonDates(newSeasonDates);

        readDatas(
          loadedClubTeamId,
          newSeasonDates,
          nextSelectedTeamCompetitionSeason.season._id,
        );
      }
    },
    [loadedClubTeamId, selected, teamCompetitionSeason],
  );

  const activateId = useCallback(
    async (id: string) => {
      latestIdRef.current = id;

      if (loadedClubTeamId === id) {
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
        setLoadedClubTeamId(id);
        return;
      }

      console.log("データ取得開始", id);

      await fetchClubTeamData(id);
    },
    [
      loadedClubTeamId,
      selected?._id,
      getCache,
      isCacheComplete,
      readItem,
      restoreCache,
      fetchClubTeamData,
    ],
  );

  const reloadAndCache = async <
    K extends keyof ClubTeamSummaryCache,
    Args extends unknown[],
  >(
    key: K,
    read: (
      ...args: Args
    ) => Promise<ClubTeamSummaryCache[K] | null | undefined>,
    ...args: Args
  ) => {
    const id = loadedClubTeamId;
    if (!id) return;

    const result = await read(...args);
    if (!result) return;

    if (latestIdRef.current !== id) return;

    saveCache(id, {
      [key]: result,
    } as Partial<ClubTeamSummaryCache>);
  };

  const value: UseClubTeamSummary = {
    id: loadedClubTeamId,
    isLoading,
    selected,
    activateId,

    tab: {
      selectedTab,
      handleSelect: handleSelectedTab,
    },

    select: {
      selectedOption: selectedteamCompetitionSeason,
      options: seasonOptions,
      handleSelect: handleSetSelectedSeason,
    },

    panels: {
      top: {
        text: `${seasonDates.normalSeason.startDate}~~~${seasonDates.normalSeason.endDate}成績`,
        key: `${selectedTab}-${seasonDates.normalSeason.startDate}`,
        isLoading: matches.isLoading,
        items: topItems,
        reloadFun: () =>
          reloadAndCache("match", () =>
            readMatches(
              loadedClubTeamId!,
              seasonDates.normalSeason.seasonRange,
            ),
          ),
      },

      player: {
        text: `${seasonDates.transferWindow.startDate}~~~${seasonDates.transferWindow.endDate}に所属した選手`,
        key: `${selectedTab}-${seasonDates.transferWindow.endDate}`,
        isLoading: players.isLoading,
        items: players.data,
        reloadFun: () =>
          reloadAndCache("player", () =>
            readPlayers(
              loadedClubTeamId!,
              seasonDates.transferWindow.seasonRange,
            ),
          ),
      },

      future_in: {
        text: `${seasonDates.future.startDate}~~~${seasonDates.future.endDate}に日本国内育成年代チームから加入予定の選手`,
        key: `${selectedTab}-${seasonDates.future.startDate}`,
        isLoading: futurein.isLoading,
        items: futurein.data,
        reloadFun: () =>
          reloadAndCache("future_in", () =>
            readFutureins(loadedClubTeamId!, seasonDates.future.seasonRange),
          ),
      },

      transfer_in: {
        text: `${seasonDates.transferWindow.startDate}~~~${seasonDates.transferWindow.endDate}に加入した選手`,
        key: `${selectedTab}-${seasonDates.transferWindow.startDate}`,
        isLoading: transferIns.isLoading,
        items: transferIns.data,
        reloadFun: () =>
          reloadAndCache("transfer_in", () =>
            readTransferIns(
              loadedClubTeamId!,
              seasonDates.transferWindow.seasonRange,
            ),
          ),
      },

      transfer_out: {
        text: `${seasonDates.transferWindow.startDate}~~~${seasonDates.transferWindow.endDate}に退団した選手`,
        key: `${selectedTab}-${seasonDates.transferWindow.startDate}`,
        isLoading: transferOuts.isLoading,
        items: transferOuts.data,
        reloadFun: () =>
          reloadAndCache("transfer_out", () =>
            readTransferOuts(
              loadedClubTeamId!,
              seasonDates.transferWindow.seasonRange,
            ),
          ),
      },

      loan: {
        text: `${seasonDates.transferWindow.startDate}~~~${seasonDates.transferWindow.endDate}に期限付き移籍した選手`,
        key: `${selectedTab}-${seasonDates.transferWindow.startDate}`,
        isLoading: loans.isLoading,
        items: loans.data,
        reloadFun: () =>
          reloadAndCache("loan", () =>
            readLoans(
              loadedClubTeamId!,
              seasonDates.transferWindow.seasonRange,
            ),
          ),
      },

      injury: {
        text: `${seasonDates.normalSeason.startDate}~~~${seasonDates.normalSeason.endDate}に発表された負傷者`,
        key: `${selectedTab}-${seasonDates.normalSeason.startDate}`,
        isLoading: injuries.isLoading,
        items: injuries.data,
        reloadFun: () =>
          reloadAndCache("injury", () =>
            readInjuries(
              loadedClubTeamId!,
              seasonDates.normalSeason.seasonRange,
            ),
          ),
      },

      match: {
        text: `${seasonDates.normalSeason.startDate}~~~${seasonDates.normalSeason.endDate}に開催された試合`,
        key: `${selectedTab}-${seasonDates.normalSeason.startDate}`,
        isLoading: matches.isLoading,
        items: matches.data,
        reloadFun: () =>
          reloadAndCache("match", () =>
            readMatches(
              loadedClubTeamId!,
              seasonDates.normalSeason.seasonRange,
            ),
          ),
      },

      playerRegistration: {
        text: `${seasonDates.normalSeason.startDate}~~~${seasonDates.normalSeason.endDate}に出場登録された選手`,
        key: `${selectedTab}-${seasonDates.normalSeason.startDate}`,
        isLoading: playerRegistrations.isLoading,
        items: playerRegistrations.data,
        reloadFun: () =>
          reloadAndCache("playerRegistration", () =>
            readPlayerRegistrations(
              loadedClubTeamId!,
              selectedteamCompetitionSeason?.season._id,
            ),
          ),
      },

      staffRegistration: {
        text: `${seasonDates.normalSeason.startDate}~~~${seasonDates.normalSeason.endDate}に出場登録されたスタッフ`,
        key: `${selectedTab}-${seasonDates.normalSeason.startDate}`,
        isLoading: staffRegistrations.isLoading,
        items: staffRegistrations.data,
        reloadFun: () =>
          reloadAndCache("staffRegistration", () =>
            readStaffRegistrations(
              loadedClubTeamId!,
              selectedteamCompetitionSeason?.season._id,
            ),
          ),
      },

      teamCompetitionSeason: {
        text: `歴代の所属カテゴリ`,
        key: `${selectedTab}`,
        isLoading: teamCompetitionSeason.isLoading,
        items: teamCompetitionSeason.data,
        reloadFun: () =>
          reloadAndCache("teamCompetitionSeason", () =>
            readTeamCompetitionSeason(loadedClubTeamId!),
          ),
      },

      statsL: {
        text: `${seasonDates.normalSeason.startDate}~~~${seasonDates.normalSeason.endDate}のスタッツ`,
        key: `${selectedTab}-${selectedteamCompetitionSeason?.season._id}`,
        isLoading: statsL.isLoading,
        items: statsL.data,
        reloadFun: () =>
          reloadAndCache("statsL", () =>
            readStatsL(
              loadedClubTeamId!,
              selectedteamCompetitionSeason?.season._id,
            ),
          ),
      },

      linePlot: {
        key: `${selectedTab}-${selectedteamCompetitionSeason?.season._id}`,
        isLoading: linePLotData.isLoading,
        text: `${selectedteamCompetitionSeason?.season.name} ${selected?.abbr || selected?.team} の勝点推移`,
        items: linePLotData,
        reloadFun: () =>
          reloadAndCache("linePlot", () =>
            readLinePlotData(
              loadedClubTeamId!,
              selectedteamCompetitionSeason?.season._id!,
            ),
          ),
      },

      radarData: {
        key: `${selectedTab}-${selectedteamCompetitionSeason?.season._id}`,
        isLoading: radarData.isLoading,
        text: `${selectedteamCompetitionSeason?.season.name} ${selected?.abbr || selected?.team} のスタッツ`,
        items: radarData,
        reloadFun: () =>
          reloadAndCache("radarData", () =>
            readRadarData(
              loadedClubTeamId!,
              selectedteamCompetitionSeason?.season._id,
            ),
          ),
      },

      appearancePlot: {
        key: `${selectedTab}-${selectedteamCompetitionSeason?.season._id}`,
        text: `${selectedteamCompetitionSeason?.season.name} ${selected?.abbr || selected?.team} のスタッツ`,
        items: appearancePlotPanel.items,
        isLoading: appearancePlotPanel.isLoading,
        reloadFun: (filterConditions, sortConditions) =>
          reloadAndCache(
            "appearancePlot",
            (filter, sort) =>
              appearancePlotPanel.reloadFun(
                filter,
                sort,
                loadedClubTeamId!,
                seasonDates.normalSeason.seasonRange,
              ),
            filterConditions,
            sortConditions,
          ),
      },

      playerStatistics: {
        key: `${selectedTab}-${selectedteamCompetitionSeason?.season._id}`,
        text: `${selectedteamCompetitionSeason?.season.name} ${selected?.abbr || selected?.team} のスタッツ`,
        items: playerStatisticPanel.items,
        isLoading: playerStatisticPanel.isLoading,
        reloadFun: (filterConditions, sortConditions) =>
          reloadAndCache(
            "playerStatistics",
            (filter, sort) =>
              playerStatisticPanel.reloadFun(
                filter,
                sort,
                loadedClubTeamId!,
                seasonDates.normalSeason.seasonRange,
              ),
            filterConditions,
            sortConditions,
          ),
      },

      formationPlot: {
        key: `${selectedTab}-${selectedteamCompetitionSeason?.season._id}`,
        text: `${selectedteamCompetitionSeason?.season.name} ${selected?.abbr || selected?.team} のスタッツ`,
        items: formationPlotPanel.items,
        isLoading: formationPlotPanel.isLoading,
        reloadFun: (filterConditions, sortConditions) =>
          reloadAndCache(
            "formationPlot",
            (filter, sort) =>
              formationPlotPanel.reloadFun(
                filter,
                sort,
                loadedClubTeamId!,
                seasonDates.normalSeason.seasonRange,
              ),
            filterConditions,
            sortConditions,
          ),
      },

      birthYearPositionMatrix: {
        key: `${selectedTab}-${selectedteamCompetitionSeason?.season._id}`,
        text: `${selectedteamCompetitionSeason?.season.name} ${selected?.abbr || selected?.team} のスタッツ`,
        items: {
          ...birthYearPositionMatrixPanel.items,
          groupedPlayers: [
            ...birthYearPositionMatrixPanel.items.groupedPlayers,
          ].reverse(),
          transferOuts: transferOuts.data,
          transferIns: transferIns.data,
          baseDate: seasonDates.normalSeason.startDate
            ? new Date(seasonDates.normalSeason.startDate)
            : undefined,
        },
        isLoading: birthYearPositionMatrixPanel.isLoading,
        reloadFun: (filterConditions, sortConditions) =>
          reloadAndCache(
            "birthYearPositionMatrix",
            (filter, sort) =>
              birthYearPositionMatrixPanel.reloadFun(
                filter,
                sort,
                loadedClubTeamId!,
                seasonDates.normalSeason.seasonRange,
              ),
            filterConditions,
            sortConditions,
          ),
      },
    },
  };

  return (
    <ClubTeamSummaryContext.Provider value={value}>
      {children}
    </ClubTeamSummaryContext.Provider>
  );
};

export const useClubTeamSummary = () => {
  const context = useContext(ClubTeamSummaryContext);

  if (!context) {
    throw new Error(
      "useClubTeamSummary must be used within ClubTeamSummaryProvider",
    );
  }

  return context;
};
