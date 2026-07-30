import {
  CompetitionStagePanel,
  MatchPanel,
  PlayerRegistrationPanel,
  SeasonPanel,
  StaffRegistrationPanel,
  StatsLActualPanel,
  StatsLDeviationPanel,
  StatsLPanel,
  StatsLRankPanel,
  TeamCompetitionSeasonPanel,
} from "../panels/index";
import { COMPETITION_TAB, UseCompetitionSummary } from "../types";

const PanelRenderer = ({ summary }: { summary: UseCompetitionSummary }) => {
  const {
    tab: { selectedTab },
  } = summary;

  switch (selectedTab) {
    case COMPETITION_TAB.COMPETITION_STAGE:
      return <CompetitionStagePanel summary={summary} />;

    case COMPETITION_TAB.MATCH:
      return <MatchPanel summary={summary} />;

    case COMPETITION_TAB.PLAYER_REGISTRATION:
      return <PlayerRegistrationPanel summary={summary} />;

    case COMPETITION_TAB.SEASON:
      return <SeasonPanel summary={summary} />;

    case COMPETITION_TAB.STAFF_REGISTRATION:
      return <StaffRegistrationPanel summary={summary} />;

    case COMPETITION_TAB.STATS_L_ACTUAL:
      return <StatsLActualPanel summary={summary} />;

    case COMPETITION_TAB.STATS_L_DEVIATION:
      return <StatsLDeviationPanel summary={summary} />;

    case COMPETITION_TAB.STATS_L_RANK:
      return <StatsLRankPanel summary={summary} />;

    case COMPETITION_TAB.STATS_L:
      return <StatsLPanel summary={summary} />;

    case COMPETITION_TAB.TEAM_COMPETITION_SEASON:
      return <TeamCompetitionSeasonPanel summary={summary} />;

    default:
      return null;
  }
};

export default PanelRenderer;
