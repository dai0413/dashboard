import { ModelType } from "../../../../../types/models";
import { UseClubTeamSummary } from "../types";
import { DataViewContainer } from "../../../../../components/dataView";
import { ViewMode } from "../../../../../types/types";
import { defFieldDefinitions } from "../constants/fields";

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
        items={items.defRadarData ? [items.defRadarData] : []}
        totalCount={10}
        itemsLoading={items.isLoading}
        reloadFun={reloadFun}
        viewModes={[ViewMode.TABLE, ViewMode.TILE, ViewMode.RADAR_CHART]}
        defaultViewMode={ViewMode.RADAR_CHART}
        viewOptions={{
          piePlot: { matchCounts: items.matchCounts },
        }}
      />
    </>
  );
};

export default PiePlotDefence;
