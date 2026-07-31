import { useEffect, useState } from "react";
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
} from "./index";
import { MATCH_TAB, MatchTab, UseMatchSummary } from "../types";
import { useMatch } from "../../../../context/models/match";

export const useMatchSummary = (id: string): UseMatchSummary => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = useMatch();

  const [selectedTab, setSelectedTab] = useState<MatchTab>(
    MATCH_TAB.HOME_STARTING_MEMBER,
  );

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as MatchTab);
  };

  const { awayStatsL, readAwayStatsL } = useAwayStatsLPanel();
  const { awaySubMembers, readAwaySubMembers } = useAwaySubMemberPanel();
  const { homeStatsL, readHomeStatsL } = useHomeStatsLPanel();
  const { homeSubMembers, readHomeSubMembers } = useHomeSubMemberPanel();
  const { playerMatchEventLogs, readPlayerMatchEventLogs } =
    usePlayerMatchEventLogPanel();
  const { refereeAppearances, readRefereeAppearances } =
    useRefereeAppearancePanel();
  const { staffAppearances, readStaffAppearances } = useStaffAppearancePanel();
  const { staffMatchEventLogs, readStaffMatchEventLogs } =
    useStaffMatchEventLogPanel();
  const { startingMembers, readStartingMembers } = useStartingMemberPanel();
  const { teamMatchFormations, readTeamMatchFormations } =
    useTeamMatchFormationPanel();

  // id変更で読み込む
  const readDatas = async (
    matchId: string,
    homeTeamId: string,
    awayTeamId: string,
  ) => {
    await Promise.all([
      readAwayStatsL(matchId, awayTeamId),
      readAwaySubMembers(matchId, awayTeamId),
      readHomeStatsL(matchId, homeTeamId),
      readHomeSubMembers(matchId, homeTeamId),
      readPlayerMatchEventLogs(matchId),
      readRefereeAppearances(matchId),
      readStaffAppearances(matchId),
      readStaffMatchEventLogs(matchId),
      readStartingMembers(matchId, homeTeamId, awayTeamId),
      readTeamMatchFormations(matchId),
    ]);
  };

  // id変更で読み込む
  const onChangeId = async (
    matchId: string,
    homeTeamId: string,
    awayTeamId: string,
  ) => {
    readDatas(matchId, homeTeamId, awayTeamId);
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      await readItem(id);
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      if (id && selected?.home_team.id && selected?.away_team.id) {
        await onChangeId(id, selected?.home_team.id, selected?.away_team.id);
      }
    })();
  }, [selected]);

  return {
    id,
    isLoading,
    selected,

    tab: {
      selectedTab,
      handleSelect: handleSelectedTab,
    },

    panels: {
      startingMember: {
        key: `${selectedTab}`,
        items: startingMembers,
        reloadFun: async () =>
          readStartingMembers(
            id,
            selected?.home_team.id,
            selected?.away_team.id,
          ),
      },

      homeSubMember: {
        key: `${selectedTab}`,
        items: homeSubMembers.data,
        reloadFun: async () => readHomeSubMembers(id, selected?.home_team.id),
      },

      awaySubMember: {
        key: `${selectedTab}`,
        items: awaySubMembers.data,
        reloadFun: async () => readAwaySubMembers(id, selected?.away_team.id),
      },

      staffAppearance: {
        key: `${selectedTab}`,
        items: staffAppearances.data,
        reloadFun: async () => readStaffAppearances(id),
      },

      playerMatchEventLog: {
        key: `${selectedTab}`,
        items: playerMatchEventLogs.data,
        reloadFun: async () => readPlayerMatchEventLogs(id),
      },

      staffMatchEventLog: {
        key: `${selectedTab}`,
        items: staffMatchEventLogs.data,
        reloadFun: async () => readStaffMatchEventLogs(id),
      },

      teamMatchFormation: {
        key: `${selectedTab}`,
        items: teamMatchFormations.data,
        reloadFun: async () => readTeamMatchFormations(id),
      },

      homeStatsL: {
        key: `${selectedTab}`,
        items: homeStatsL.data,
        reloadFun: async () => readHomeStatsL(id),
      },

      awayStatsL: {
        key: `${selectedTab}`,
        items: awayStatsL.data,
        reloadFun: async () => readAwayStatsL(id),
      },

      refereeAppearance: {
        key: `${selectedTab}`,
        items: refereeAppearances.data,
        reloadFun: async () => readRefereeAppearances(id),
      },
    },
  };
};
