import { ModelType } from "../../../../../types/models";
import { UseClubTeamSummary } from "../types";
import { DataViewContainer } from "../../../../../components/dataView";
import { ViewMode } from "../../../../../types/types";
import { offFieldDefinitions } from "../constants/fields";
import { radarFields } from "../../../../../components/plot/RadarChart/radarFields";

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
        fieldDefinitions={offFieldDefinitions}
        totalCount={10}
        itemsLoading={items.isLoading}
        reloadFun={reloadFun}
        viewModes={[ViewMode.TABLE, ViewMode.TILE, ViewMode.RADAR_CHART]}
        defaultViewMode={ViewMode.RADAR_CHART}
        viewData={{
          [ViewMode.TABLE]: items.offRadarData
            ? [items.offRadarData]
            : undefined,
          [ViewMode.TILE]: items.offRadarData
            ? [items.offRadarData]
            : undefined,
          [ViewMode.RADAR_CHART]: items.offRadarData
            ? {
                data: items.offRadarData,
                fields: radarFields,
                label: `${items.matchCounts || 0}試合`,
              }
            : undefined,
        }}
      />
    </>
  );
};

export default PiePlotAttack;
