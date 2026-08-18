import { useCallback, useEffect, useState } from "react";
import { useTeam } from "../../../../../context/models/team";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { getWindowDates } from "../../../../../utils/date/getWindowDates";
import { ModelType } from "../../../../../types/models";
import { TeamCompetitionSeason } from "../../../../../types/models/team-competition-season";
import { TeamGet } from "../../../../../types/models/team";
import { SeasonDates } from "../../../../../types/seasonDates";
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
} from "./index";
import { CLUB_TEAM_TAB, ClubTeamTab, UseClubTeamSummary } from "../types";

export const useClubTeamSummary = (id: string): UseClubTeamSummary => {
  const {
    metacrud: { selected, isLoading, readItem },
  } = useTeam();

  const [selectedTab, setSelectedTab] = useState<ClubTeamTab>(
    CLUB_TEAM_TAB.PLAYER,
  );

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as ClubTeamTab);
  };

  const { players, readPlayers } = usePlayerPanel();
  const { futurein, readFutureins } = useFutureInPanel();
  const { transferIns, readTransferIns } = useTransferInPanel();
  const { transferOuts, readTransferOuts } = useTransferOutPanel();
  const { loans, readLoans } = useLoanPanel();
  const { injuries, readInjuries } = useInjuryPanel();
  const { matches, readMatches } = useMatchPanel();
  const { playerRegistrations, readPlayerRegistrations } =
    usePlayerRegistrationPanel();
  const { statsL, readStatsL } = useStatsLPanel();
  const { staffRegistrations, readStaffRegistrations } =
    useStaffRegistrationPanel();

  const { offRadarData, defRadarData, radarDataIsLoading, readRadarData } =
    useRadarPanel();
  const { readPlotData, teamMatchs, plotData } = useLinePlotPanel();
  const {
    selectedteamCompetitionSeason,
    setSelectedTeamCompetitionSeason,
    seasonDates,
    setSeasonDates,
  } = useSelectOption();
  const { teamCompetitionSeason, readTeamCompetitionSeason, seasonOptions } =
    useTeamCompetitionSeasonPanel();

  const {
    playerAppearance,
    playerStatistics,
    matches: appearancePlotMatches,
    playerRegistrations: appearancePlotRegistrations,
    formationCounts,
    appearancePlotIsLoading,
    readAppearancePlot,
  } = useAppearancePlotPanel();

  // id変更, season変更両方で読み込む
  const readDatas = async (
    teamId: string,
    team: TeamGet,
    seasonDates: {
      normalSeason: SeasonDates;
      transferWindow: SeasonDates;
      future: SeasonDates;
    },
    seasonId: string,
  ) => {
    await Promise.all([
      readPlotData(teamId, seasonId),
      readRadarData(team, teamId, seasonId),
      readPlayers(teamId, seasonDates.transferWindow.seasonRange),
      readFutureins(teamId, [
        `>=${seasonDates.future.startDate}`,
        `<=${seasonDates.future.endDate}`,
      ]),
      readTransferIns(teamId, seasonDates.transferWindow.seasonRange),
      readTransferOuts(teamId, seasonDates.transferWindow.seasonRange),
      readLoans(teamId, seasonDates.transferWindow.seasonRange),
      readInjuries(teamId, seasonDates.normalSeason.seasonRange),
      readMatches(teamId, seasonDates.normalSeason.seasonRange),
      readPlayerRegistrations(teamId, seasonId),
      readStatsL(teamId, seasonId),
      readStaffRegistrations(teamId, seasonId),
      readAppearancePlot(teamId, seasonDates.normalSeason.seasonRange),
    ]);
  };

  // id変更で読み込む
  const onChangeTeam = async (teamId: string, team: TeamGet) => {
    const newSeasons = await readTeamCompetitionSeason(teamId);

    if (newSeasons && newSeasons.length > 0) {
      const seasons: TeamCompetitionSeason[] = newSeasons;

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

      if (nextSelectedTeamCompetitionSeason) {
        const nextSeasonRange = convert(
          ModelType.SEASON,
          nextSelectedTeamCompetitionSeason.season,
        );
        const newSeasonDates = getWindowDates(nextSeasonRange);
        setSeasonDates(newSeasonDates);

        setSelectedTeamCompetitionSeason(nextSelectedTeamCompetitionSeason);

        readDatas(
          teamId,
          team,
          newSeasonDates,
          nextSelectedTeamCompetitionSeason.season._id,
        );
      }
    }
  };

  // season選択で読み込む
  const handleSetSelectedSeason = useCallback(
    (seasonId: string | number | Date | undefined) => {
      const nextSelectedTeamCompetitionSeason =
        teamCompetitionSeason.data.find((s) => s._id === seasonId) ?? null;

      setSelectedTeamCompetitionSeason(nextSelectedTeamCompetitionSeason);

      if (id && selected && nextSelectedTeamCompetitionSeason) {
        const newSeason = convert(
          ModelType.SEASON,
          nextSelectedTeamCompetitionSeason.season,
        );

        const newSeasonDates = getWindowDates(newSeason);

        setSeasonDates(newSeasonDates);

        readDatas(
          id,
          selected,
          newSeasonDates,
          nextSelectedTeamCompetitionSeason.season._id,
        );
      }
    },
    [id, selected, teamCompetitionSeason],
  );

  useEffect(() => {
    (async () => {
      if (id) {
        await readItem(id);
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      if (id && selected) {
        await onChangeTeam(id, selected);
      }
    })();
  }, [selected]);

  return {
    id,
    isLoading,
    selected,

    select: {
      selectedOption: selectedteamCompetitionSeason,
      options: seasonOptions,
      handleSelect: handleSetSelectedSeason,
    },

    tab: {
      selectedTab,
      handleSelect: handleSelectedTab,
    },

    panels: {
      player: {
        text: `${seasonDates.transferWindow.startDate}~~~${seasonDates.transferWindow.endDate}に所属した選手`,
        key: `${selectedTab}-${seasonDates.transferWindow.endDate}`,
        items: players.data,
        reloadFun: async () =>
          readPlayers(id, seasonDates.transferWindow.seasonRange),
      },

      future_in: {
        text: `${seasonDates.future.startDate}~~~${seasonDates.future.endDate}に日本国内育成年代チームから加入予定の選手`,
        key: `${selectedTab}-${seasonDates.future.startDate}`,
        items: futurein.data,
        reloadFun: async () =>
          readFutureins(id, seasonDates.future.seasonRange),
      },

      transfer_in: {
        text: `${seasonDates.transferWindow.startDate}~~~${seasonDates.transferWindow.endDate}に加入した選手`,
        key: `${selectedTab}-${seasonDates.transferWindow.startDate}`,
        items: transferIns.data,
        reloadFun: async () =>
          readTransferIns(id, seasonDates.transferWindow.seasonRange),
      },

      transfer_out: {
        text: `${seasonDates.transferWindow.startDate}~~~${seasonDates.transferWindow.endDate}に退団した選手`,
        key: `${selectedTab}-${seasonDates.transferWindow.startDate}`,
        items: transferOuts.data,
        reloadFun: async () =>
          readTransferOuts(id, seasonDates.transferWindow.seasonRange),
      },

      loan: {
        text: `${seasonDates.transferWindow.startDate}~~~${seasonDates.transferWindow.endDate}に期限付き移籍した選手`,
        key: `${selectedTab}-${seasonDates.transferWindow.startDate}`,
        items: loans.data,
        reloadFun: async () =>
          readLoans(id, seasonDates.transferWindow.seasonRange),
      },

      injury: {
        text: `${seasonDates.normalSeason.startDate}~~~${seasonDates.normalSeason.endDate}に発表された負傷者`,
        key: `${selectedTab}-${seasonDates.normalSeason.startDate}`,
        items: injuries.data,
        reloadFun: async () =>
          readInjuries(id, seasonDates.normalSeason.seasonRange),
      },

      match: {
        text: `${seasonDates.normalSeason.startDate}~~~${seasonDates.normalSeason.endDate}に開催された試合`,
        key: `${selectedTab}-${seasonDates.normalSeason.startDate}`,
        items: matches.data,
        reloadFun: async () =>
          readMatches(id, seasonDates.normalSeason.seasonRange),
      },

      playerRegistration: {
        text: `${seasonDates.normalSeason.startDate}~~~${seasonDates.normalSeason.endDate}に出場登録された選手`,
        key: `${selectedTab}-${seasonDates.normalSeason.startDate}`,
        items: playerRegistrations.data,
        reloadFun: async () =>
          readPlayerRegistrations(
            id,
            selectedteamCompetitionSeason?.season._id,
          ),
      },

      staffRegistration: {
        text: `${seasonDates.normalSeason.startDate}~~~${seasonDates.normalSeason.endDate}に出場登録されたスタッフ`,
        key: `${selectedTab}-${seasonDates.normalSeason.startDate}`,
        items: staffRegistrations.data,
        reloadFun: async () =>
          readStaffRegistrations(id, selectedteamCompetitionSeason?.season._id),
      },

      teamCompetitionSeason: {
        text: `歴代の所属カテゴリ`,
        key: `${selectedTab}`,
        items: teamCompetitionSeason.data,
        reloadFun: async () => {
          readTeamCompetitionSeason(id);

          return;
        },
      },

      statsL: {
        text: `${seasonDates.normalSeason.startDate}~~~${seasonDates.normalSeason.endDate}のスタッツ`,
        key: `${selectedTab}-${selectedteamCompetitionSeason?.season._id}`,
        items: statsL.data,
        reloadFun: async () =>
          readStatsL(id, selectedteamCompetitionSeason?.season._id),
      },

      linePlot: {
        key: `${selectedTab}-${selectedteamCompetitionSeason?.season._id}`,
        text: `${selectedteamCompetitionSeason?.season.name} ${selected?.abbr || selected?.team} の勝点推移`,
        items: { teamMatchs, plotData },
      },

      piePlot: {
        key: `${selectedTab}-${selectedteamCompetitionSeason?.season._id}`,
        text: `${selectedteamCompetitionSeason?.season.name} ${selected?.abbr || selected?.team} のスタッツ`,
        items: { offRadarData, defRadarData, isLoading: radarDataIsLoading },
        reloadFun: async () =>
          readRadarData(
            selected,
            id,
            selectedteamCompetitionSeason?.season._id,
          ),
      },

      appearancePlot: {
        key: `${selectedTab}-${selectedteamCompetitionSeason?.season._id}`,
        text: `${selectedteamCompetitionSeason?.season.name} ${selected?.abbr || selected?.team} のスタッツ`,
        items: {
          playerAppearance,
          playerRegistrations: appearancePlotRegistrations,
          playerStatistics,
          matches: appearancePlotMatches,
          formationCounts,
        },
        isLoading: appearancePlotIsLoading,
        reloadFun: async () =>
          readAppearancePlot(id, seasonDates.normalSeason.seasonRange),
      },

      playerStatistics: {
        key: `${selectedTab}-${selectedteamCompetitionSeason?.season._id}`,
        text: `${selectedteamCompetitionSeason?.season.name} ${selected?.abbr || selected?.team} のスタッツ`,
        items: playerStatistics,
        isLoading: appearancePlotIsLoading,
        reloadFun: async () =>
          readAppearancePlot(id, seasonDates.normalSeason.seasonRange),
      },
    },
  };
};
