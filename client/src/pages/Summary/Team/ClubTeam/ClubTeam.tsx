import { useParams } from "react-router-dom";
import SummaryTabMenu from "../../components/SummaryTabMenu";
import { useClubTeamSummary } from "./hooks/useClubTeamSummary";
import { Info, PanelRenderer } from "./components/index";
import { tabItems } from "./constants/tabs";

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

      <section
        className="space-y-4 rounded-xl border border-gray-200 border-l-4 bg-white p-4 shadow-sm"
        style={{
          borderLeftColor: primaryColor || "#E5E7EB",
        }}
      >
        <PanelRenderer summary={summary} />
      </section>
    </div>
  );
};

export default ClubTeam;
