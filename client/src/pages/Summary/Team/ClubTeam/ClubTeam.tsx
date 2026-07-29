import { useParams } from "react-router-dom";
import SummaryTabMenu from "../../components/SummaryTabMenu";
import { useClubTeamSummary } from "./hooks/useClubTeamSummary";
import { Info, PanelRenderer } from "./components/index";
import { tabItems } from "./constants/tabs";

const ClubTeam = () => {
  const { id } = useParams();

  if (!id) return;
  const summary = useClubTeamSummary(id);

  return (
    <div className="p-6">
      <Info summary={summary} />

      <SummaryTabMenu
        items={tabItems}
        selectedTab={summary.selectedTab}
        onChange={summary.handleSelectedTab}
      />

      <PanelRenderer summary={summary} />
    </div>
  );
};

export default ClubTeam;
