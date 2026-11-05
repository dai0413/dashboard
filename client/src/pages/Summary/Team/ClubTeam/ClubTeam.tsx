import { useParams } from "react-router-dom";
import SummaryTabMenu from "../../components/SummaryTabMenu";
import { useClubTeamSummary } from "./hooks/useClubTeamSummary";
import { Info, PanelRenderer } from "./components/index";
import { tabItems } from "./constants/tabs";
import { AccentSection } from "../../../../components/layout";

const ClubTeam = () => {
  const { id } = useParams();

  if (!id) return;
  const summary = useClubTeamSummary(id);
  const primaryColor = summary.selected?.primaryColor;

  return (
    <div className="p-6">
      <Info summary={summary} />

      <SummaryTabMenu
        items={tabItems}
        tab={summary.tab}
        accentColor={primaryColor}
      />

      <AccentSection primaryColor={primaryColor}>
        <PanelRenderer summary={summary} />
      </AccentSection>
    </div>
  );
};

export default ClubTeam;
