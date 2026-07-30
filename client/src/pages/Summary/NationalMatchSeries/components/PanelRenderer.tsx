import { NationalCllupPanel, MatchPanel } from "../panels/index";
import {
  NATIONAL_MATCH_SERIES_TAB,
  UseNationalMatchSeriesSummary,
} from "../types";

const PanelRenderer = ({
  summary,
}: {
  summary: UseNationalMatchSeriesSummary;
}) => {
  const {
    tab: { selectedTab },
  } = summary;

  switch (selectedTab) {
    case NATIONAL_MATCH_SERIES_TAB.NATIONAL_CALLUP:
      return <NationalCllupPanel summary={summary} />;

    case NATIONAL_MATCH_SERIES_TAB.MATCH:
      return <MatchPanel summary={summary} />;

    default:
      return null;
  }
};

export default PanelRenderer;
