import {
  PlayerPanel,
  FutureInPanel,
  TransferInPanel,
  TransferOutPanel,
  LoanPanel,
  InjuryPanel,
  MatchPanel,
  PlayerRegistrationPanel,
  TeamCompetitionSeasonPanel,
  StatsLPanel,
  LinePlotPanel,
  PiePlotAttack,
  PiePlotDefence,
  StaffRegistrationPanel,
  AppearancePlot,
  PlayerStatisticsPanel,
} from "../panels/index";
import { CLUB_TEAM_TAB, UseClubTeamSummary } from "../types";

const PanelRenderer = ({ summary }: { summary: UseClubTeamSummary }) => {
  const {
    tab: { selectedTab },
  } = summary;

  switch (selectedTab) {
    case CLUB_TEAM_TAB.PLAYER:
      return <PlayerPanel summary={summary} />;

    case CLUB_TEAM_TAB.FUTURE_IN:
      return <FutureInPanel summary={summary} />;

    case CLUB_TEAM_TAB.TRANSFER_IN:
      return <TransferInPanel summary={summary} />;

    case CLUB_TEAM_TAB.TRANSFER_OUT:
      return <TransferOutPanel summary={summary} />;

    case CLUB_TEAM_TAB.LOAN:
      return <LoanPanel summary={summary} />;

    case CLUB_TEAM_TAB.INJURY:
      return <InjuryPanel summary={summary} />;

    case CLUB_TEAM_TAB.MATCH:
      return <MatchPanel summary={summary} />;

    case CLUB_TEAM_TAB.PLAYER_REGISTRATION:
      return <PlayerRegistrationPanel summary={summary} />;

    case CLUB_TEAM_TAB.STAFF_REGISTRATION:
      return <StaffRegistrationPanel summary={summary} />;

    case CLUB_TEAM_TAB.TEAM_COMPETITION_SEASON:
      return <TeamCompetitionSeasonPanel summary={summary} />;

    case CLUB_TEAM_TAB.STATS_L:
      return <StatsLPanel summary={summary} />;

    case CLUB_TEAM_TAB.LINE_PLOT:
      return <LinePlotPanel summary={summary} />;

    case CLUB_TEAM_TAB.PIE_PLOT_ATTACK:
      return <PiePlotAttack summary={summary} />;

    case CLUB_TEAM_TAB.PIE_PLOT_DEFENCE:
      return <PiePlotDefence summary={summary} />;

    case CLUB_TEAM_TAB.APPEARANCE_PLOT:
      return <AppearancePlot summary={summary} />;

    case CLUB_TEAM_TAB.PLAYER_STATISTICS:
      return <PlayerStatisticsPanel summary={summary} />;

    default:
      return null;
  }
};

export default PanelRenderer;
