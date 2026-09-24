import { ModelType } from "../../../../../types/models";
import { UseClubTeamSummary } from "../types";
import { DataViewContainer } from "../../../../../components/dataView";
import { ViewMode } from "../../../../../types/types";
import { defFieldDefinitions } from "../constants/fields";
import { radarFields } from "../../../../../components/plot/RadarChart/radarFields";

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
        fieldDefinitions={defFieldDefinitions}
        totalCount={10}
        itemsLoading={items.isLoading}
        reloadFun={reloadFun}
        viewModes={[ViewMode.TABLE, ViewMode.TILE, ViewMode.RADAR_CHART]}
        defaultViewMode={ViewMode.RADAR_CHART}
        viewData={{
          [ViewMode.TABLE]: items.defRadarData
            ? [items.defRadarData]
            : undefined,
          [ViewMode.TILE]: items.defRadarData
            ? [items.defRadarData]
            : undefined,
          [ViewMode.RADAR_CHART]: items.defRadarData
            ? {
                data: items.defRadarData,
                fields: radarFields,
                label: `${items.matchCounts || 0}試合`,
              }
            : undefined,
        }}
      />
    </>
  );
};

export default PiePlotDefence;
