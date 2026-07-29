import { useParams } from "react-router-dom";
import SummaryTabMenu from "../../components/SummaryTabMenu";
import { useNationalTeamSummary } from "./hooks/useNationalTeamSummary";
import { Info, PanelRenderer } from "./components";
import { tabItems } from "./constants/tabs";

const NationalTeam = () => {
  const { id } = useParams();

  if (!id) return;
  const summary = useNationalTeamSummary(id);

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

export default NationalTeam;
