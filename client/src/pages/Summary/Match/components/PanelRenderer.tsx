import {
  AwayStatingMemberPanel,
  AwayStatsLPanel,
  AwaySubMemberPanel,
  HomeStatingMemberPanel,
  HomeStatsLPanel,
  HomeSubMemberPanel,
  PlayerMatchEventLogPanel,
  RefereeAppearancePanel,
  StaffAppearancePanel,
  StaffMatchEventLogPanel,
  TeamMatchFormationPanel,
} from "../panels/index";
import { MATCH_TAB, UseMatchSummary } from "../types";

const PanelRenderer = ({ summary }: { summary: UseMatchSummary }) => {
  const {
    tab: { selectedTab },
  } = summary;

  switch (selectedTab) {
    case MATCH_TAB.AWAY_STARTING_MEMBER:
      return <AwayStatingMemberPanel summary={summary} />;

    case MATCH_TAB.AWAY_STATS_L:
      return <AwayStatsLPanel summary={summary} />;

    case MATCH_TAB.AWAY_SUB_MEMBER:
      return <AwaySubMemberPanel summary={summary} />;

    case MATCH_TAB.HOME_STARTING_MEMBER:
      return <HomeStatingMemberPanel summary={summary} />;

    case MATCH_TAB.HOME_STATS_L:
      return <HomeStatsLPanel summary={summary} />;

    case MATCH_TAB.HOME_SUB_MEMBER:
      return <HomeSubMemberPanel summary={summary} />;

    case MATCH_TAB.PLAYER_MATCH_EVENT_LOG:
      return <PlayerMatchEventLogPanel summary={summary} />;

    case MATCH_TAB.REFEREE_APPEARANCE:
      return <RefereeAppearancePanel summary={summary} />;

    case MATCH_TAB.STAFF_APPEARANCE:
      return <StaffAppearancePanel summary={summary} />;

    case MATCH_TAB.STAFF_MATCH_EVENT_LOG:
      return <StaffMatchEventLogPanel summary={summary} />;

    case MATCH_TAB.TEAM_MATCH_FORMATION:
      return <TeamMatchFormationPanel summary={summary} />;

    default:
      return null;
  }
};

export default PanelRenderer;
