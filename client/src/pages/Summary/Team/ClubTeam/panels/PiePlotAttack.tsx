import { ModelType } from "../../../../../types/models";
import { UseClubTeamSummary } from "../types";
import { DataViewContainer } from "../../../../../components/table";
import { RadarChart } from "../../../../../components/plot/RadarChart/RadarChart";

const PiePlotAttack = ({ summary }: { summary: UseClubTeamSummary }) => {
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
        items={items.offRadarData?.datasets || []}
        totalCount={items.offRadarData?.datasets.length || 0}
        itemsLoading={items.isLoading}
        reloadFun={reloadFun}
        initialData={{
          formData: {},
          metaData: {},
        }}
        renderView={() => (
          <RadarChart
            labels={items.offRadarData?.labels || []}
            datasets={items.offRadarData?.datasets || []}
          />
        )}
      />
    </>
  );
};

export default PiePlotAttack;
