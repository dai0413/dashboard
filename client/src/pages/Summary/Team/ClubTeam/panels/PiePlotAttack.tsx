import { ModelType } from "../../../../../types/models";
import { UseClubTeamSummary } from "../types";
import { DataViewContainer } from "../../../../../components/dataView";
import { RadarChart } from "../../../../../components/plot/RadarChart/RadarChart";
import { ViewMode } from "../../../../../types/types";

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
        viewModes={[ViewMode.TABLE, ViewMode.TILE, ViewMode.RADAR_CHART]}
        defaultViewMode={ViewMode.RADAR_CHART}
      />
    </>
  );
};

export default PiePlotAttack;
