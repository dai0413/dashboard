import { UseRefereeSummary } from "../types";

const PanelRenderer = ({ summary }: { summary: UseRefereeSummary }) => {
  const {
    tab: { selectedTab },
  } = summary;

  switch (selectedTab) {
    default:
      return null;
  }
};

export default PanelRenderer;
