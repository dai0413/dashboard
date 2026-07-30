import { ModelType } from "../../../../../types/models";
import { UseClubTeamSummary } from "../types";
import { CustomTableContainer } from "../../../../../components/table";
import { RadarChart } from "../../../../../components/plot/RadarChart/RadarChart";

const PiePlotDefence = ({ summary }: { summary: UseClubTeamSummary }) => {
  const {
    panels: {
      piePlot: { text, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <CustomTableContainer
        modelType={ModelType.STATS_L}
        fieldDefinitions={[]}
        pageNum={1}
        items={items.defRadarData?.datasets || []}
        itemsLoading={items.isLoading}
        reloadFun={reloadFun}
        renderView={() => (
          <RadarChart
            labels={items.defRadarData?.labels || []}
            datasets={items.defRadarData?.datasets || []}
          />
        )}
      />
    </>
  );
};

export default PiePlotDefence;
