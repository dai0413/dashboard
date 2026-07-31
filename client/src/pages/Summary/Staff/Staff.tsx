import { useParams } from "react-router-dom";
import SummaryTabMenu from "../components/SummaryTabMenu";
import { tabItems } from "./constants/tabs";
import { useStaffSummary } from "./hooks/useStaffSummary";
import { Info, PanelRenderer } from "./components";

const Staff = () => {
  const { id } = useParams();

  if (!id) return;

  const summary = useStaffSummary(id);

  return (
    <div className="p-6">
      <Info summary={summary} />

      <SummaryTabMenu items={tabItems} tab={summary.tab} />

      <PanelRenderer summary={summary} />
    </div>
  );
};

export default Staff;
