import { useParams } from "react-router-dom";
import SummaryTabMenu from "../components/SummaryTabMenu";
import { tabItems } from "./constants/tabs";
import { Info, PanelRenderer } from "./components";
import { useMatchSummary } from "./hooks/useMatchSummary";

const Match = () => {
  const { id } = useParams();
  if (!id) return;

  const summary = useMatchSummary(id);

  return (
    <div className="p-6">
      <Info summary={summary} />

      <SummaryTabMenu items={tabItems} tab={summary.tab} />

      <PanelRenderer summary={summary} />
    </div>
  );
};

export default Match;
