import { CompetitionPanel, TeamPanel } from "../panels/index";
import { NATIONAL_TAB, UseNationalSummary } from "../types";

const PanelRenderer = ({ summary }: { summary: UseNationalSummary }) => {
  const {
    tab: { selectedTab },
  } = summary;

  switch (selectedTab) {
    case NATIONAL_TAB.COMPETITION:
      return <CompetitionPanel summary={summary} />;

    case NATIONAL_TAB.TEAM:
      return <TeamPanel summary={summary} />;

    default:
      return null;
  }
};

export default PanelRenderer;
