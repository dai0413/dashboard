import { useParams } from "react-router-dom";
import SummaryTabMenu from "../../components/SummaryTabMenu";
import { Info, PanelRenderer } from "./components/index";
import { tabItems } from "./constants/tabs";
import { AccentSection } from "../../../../components/layout";
import { useClubTeamSummary } from "./contexts/ClubTeamSummaryContext";
import { useEffect, useRef } from "react";

const ClubTeam = () => {
  const { id } = useParams();
  const summary = useClubTeamSummary();

  const activateIdRef = useRef(summary.activateId);

  useEffect(() => {
    activateIdRef.current = summary.activateId;
  }, [summary.activateId]);

  useEffect(() => {
    if (!id) return;

    void activateIdRef.current(id);
  }, [id]);

  if (!id) return;

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
