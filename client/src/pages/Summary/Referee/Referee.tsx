import { useParams } from "react-router-dom";
import { SummaryTabItems } from "../../../types/menu/IconButton";
import SummaryTabMenu from "../components/SummaryTabMenu";
import { Info, PanelRenderer } from "./components";
import { useRefereeSummary } from "./hooks/useRefereeSummary";

const tabItems: SummaryTabItems[] = [];

const Referee = () => {
  const { id } = useParams();

  if (!id) return;

  const summary = useRefereeSummary(id);

  return (
    <div className="p-6">
      {/* Header情報 */}

      <Info summary={summary} />

      <SummaryTabMenu items={tabItems} tab={summary.tab} />

      <PanelRenderer summary={summary} />
    </div>
  );
};

export default Referee;
