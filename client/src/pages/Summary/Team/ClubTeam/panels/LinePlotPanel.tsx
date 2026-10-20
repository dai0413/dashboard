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
      <h2 className="text-base font-semibold text-gray-800">{text}</h2>
      <PointLine teamMatchs={items.teamMatchs} plotData={items.plotData} />
    </>
  );
};

export default LinePlotPanel;
