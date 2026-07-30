import {
  MatchPanel,
  PlayerPanel,
  PlayerPlotPanel,
  SeriesPanel,
} from "../panels/index";
import { NATIONAL_TEAM_TAB, UseNationalTeamSummary } from "../types";

const PanelRenderer = ({ summary }: { summary: UseNationalTeamSummary }) => {
  const {
    tab: { selectedTab },
  } = summary;

  switch (selectedTab) {
    case NATIONAL_TEAM_TAB.MATCH:
      return <MatchPanel summary={summary} />;

    case NATIONAL_TEAM_TAB.PLAYER:
      return <PlayerPanel summary={summary} />;

    case NATIONAL_TEAM_TAB.SERIES:
      return <SeriesPanel summary={summary} />;

    case NATIONAL_TEAM_TAB.PLAYER_PLOT:
      return <PlayerPlotPanel summary={summary} />;

    default:
      return null;
  }
};

export default PanelRenderer;
