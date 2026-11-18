import { ModelType } from "../../../../../types/models";
import { UseClubTeamSummary } from "../types";
import { DataViewContainer } from "../../../../../components/dataView";
import { ViewMode } from "../../../../../types/types";
import { offFieldDefinitions } from "../constants/fields";
import { radarFields } from "../../../../../components/plot/RadarChart/radarFields";

const PiePlotAttack = ({ summary }: { summary: UseClubTeamSummary }) => {
  const {
    panels: {
      radarData: { text, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <h2 className="text-base font-semibold text-gray-800">{text}</h2>
      <DataViewContainer
        modelType={ModelType.STATS_L}
        fieldDefinitions={offFieldDefinitions}
        totalCount={10}
        itemsLoading={items.isLoading}
        reloadFun={reloadFun}
        viewModes={[ViewMode.TABLE, ViewMode.TILE, ViewMode.RADAR_CHART]}
        defaultViewMode={ViewMode.RADAR_CHART}
        viewData={{
          [ViewMode.TABLE]: items.data.offRadarData
            ? [items.data.offRadarData]
            : undefined,
          [ViewMode.TILE]: items.data.offRadarData
            ? [items.data.offRadarData]
            : undefined,
          [ViewMode.RADAR_CHART]: items.data.offRadarData
            ? {
                data: items.data.offRadarData,
                fields: radarFields,
                label: `${items.data.matchCounts || 0}試合`,
              }
            : undefined,
        }}
      />
    </>
  );
};

export default PiePlotAttack;
