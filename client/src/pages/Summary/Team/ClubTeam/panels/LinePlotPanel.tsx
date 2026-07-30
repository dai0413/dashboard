import { UseClubTeamSummary } from "../types";
import PointLine from "../../../../../components/plot/PointLine";

const LinePlotPanel = ({ summary }: { summary: UseClubTeamSummary }) => {
  const {
    panels: {
      linePlot: { text, items },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <PointLine teamMatchs={items.teamMatchs} plotData={items.plotData} />
    </>
  );
};

export default LinePlotPanel;
