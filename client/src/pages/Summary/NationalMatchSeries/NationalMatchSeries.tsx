import { useParams } from "react-router-dom";
import SummaryTabMenu from "../components/SummaryTabMenu";
import { tabItems } from "./constants/tabs";
import { Info, PanelRenderer } from "./components";
import { AccentSection } from "../../../components/layout";
import { useNationalMatchSeriesSummary } from "./contexts/NationalMatchSeriesSummaryContext";
import { useEffect, useRef } from "react";

const NationalMatchSeries = () => {
  const { id } = useParams();
  const summary = useNationalMatchSeriesSummary();

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
      <Info summary={summary} />

      <SummaryTabMenu items={tabItems} tab={summary.tab} />

      <AccentSection>
        <PanelRenderer summary={summary} />
      </AccentSection>
    </div>
  );
};

export default NationalMatchSeries;
