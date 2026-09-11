import { ModelType } from "../../../../../types/models";
import { UseClubTeamSummary } from "../types";
import { DataViewContainer } from "../../../../../components/table";
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
      <DataViewContainer
        modelType={ModelType.STATS_L}
        fieldDefinitions={[]}
        items={items.defRadarData?.datasets || []}
        totalCount={items.defRadarData?.datasets.length || 0}
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
