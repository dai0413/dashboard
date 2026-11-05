import { useParams } from "react-router-dom";
import SummaryTabMenu from "../components/SummaryTabMenu";
import { tabItems } from "./constants/tabs";
import { useStaffSummary } from "./hooks/useStaffSummary";
import { Info, PanelRenderer } from "./components";
import { AccentSection } from "../../../components/layout";

const Staff = () => {
  const { id } = useParams();

  if (!id) return;

  const summary = useStaffSummary(id);

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

export default Staff;
