import { StaffRegistrationPanel } from "../panels/index";
import { STAFF_TAB, UseStaffSummary } from "../types";

const PanelRenderer = ({ summary }: { summary: UseStaffSummary }) => {
  const {
    tab: { selectedTab },
  } = summary;

  switch (selectedTab) {
    case STAFF_TAB.STAFF_REGISTRATION:
      return <StaffRegistrationPanel summary={summary} />;

    default:
      return null;
  }
};

export default PanelRenderer;
