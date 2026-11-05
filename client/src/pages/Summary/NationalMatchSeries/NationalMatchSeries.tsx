import { useParams } from "react-router-dom";
import SummaryTabMenu from "../components/SummaryTabMenu";
import { tabItems } from "./constants/tabs";
import { Info, PanelRenderer } from "./components";
import { useNationalMatchSeriesSummary } from "./hooks/useNationalMatchSeriesSummary";
import { AccentSection } from "../../../components/layout";

const NationalMatchSeries = () => {
  const { id } = useParams();

  if (!id) return;

  const summary = useNationalMatchSeriesSummary(id);

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
