import { useParams } from "react-router-dom";
import SummaryTabMenu from "../../components/SummaryTabMenu";
import { useNationalTeamSummary } from "./hooks/useNationalTeamSummary";
import { Info, PanelRenderer } from "./components";
import { tabItems } from "./constants/tabs";
import { AccentSection } from "../../../../components/layout";

const NationalTeam = () => {
  const { id } = useParams();

  if (!id) return;
  const summary = useNationalTeamSummary(id);

  const primaryColor = summary.selected?.primaryColor || "black";

  return (
    <div className="p-6">
      <Info summary={summary} />

      <SummaryTabMenu items={tabItems} tab={summary.tab} />

      <AccentSection primaryColor={primaryColor}>
        <PanelRenderer summary={summary} />
      </AccentSection>
    </div>
  );
};

export default NationalTeam;
