import { useParams } from "react-router-dom";
import { SummaryTabItems } from "../../../types/menu/IconButton";
import SummaryTabMenu from "../components/SummaryTabMenu";
import { Info, PanelRenderer } from "./components";
import { AccentSection } from "../../../components/layout";
import { useRefereeSummary } from "./contexts/RefereeSummaryContext";
import { useEffect, useRef } from "react";

const tabItems: SummaryTabItems[] = [];

const Referee = () => {
  const { id } = useParams();
  const summary = useRefereeSummary();

  const activateIdRef = useRef(summary.activateId);

  useEffect(() => {
    activateIdRef.current = summary.activateId;
  }, [summary.activateId]);

  useEffect(() => {
    if (!id) return;

    void activateIdRef.current(id);
  }, [id]);

  if (!id) return;

  return (
    <div className="p-6">
      {/* Header情報 */}

      <Info summary={summary} />

      <SummaryTabMenu items={tabItems} tab={summary.tab} />

      <AccentSection>
        <PanelRenderer summary={summary} />
      </AccentSection>
    </div>
  );
};

export default Referee;
