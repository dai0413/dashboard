import { useParams } from "react-router-dom";
import SummaryTabMenu from "../components/SummaryTabMenu";
import { tabItems } from "./constants/tabs";
import { Info, PanelRenderer } from "./components";
import { useNationalMatchSeriesSummary } from "./hooks/useNationalMatchSeriesSummary";

const NationalMatchSeries = () => {
  const { id } = useParams();

  if (!id) return;

  const summary = useNationalMatchSeriesSummary(id);

  return (
    <div className="p-6">
      <Info summary={summary} />

      <SummaryTabMenu items={tabItems} tab={summary.tab} />

      <PanelRenderer summary={summary} />
    </div>
  );
};

export default NationalMatchSeries;
