import { useParams } from "react-router-dom";
import SummaryTabMenu from "../components/SummaryTabMenu";
import { tabItems } from "./constants/tabs";
import { Info, PanelRenderer } from "./components";
import { useMatchSummary } from "./hooks/useMatchSummary";
import { AccentSection } from "../../../components/layout";

const Match = () => {
  const { id } = useParams();
  if (!id) return;

  const summary = useMatchSummary(id);

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

export default Match;
