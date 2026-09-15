import { ModelType } from "../../../../../types/models";
import { UseClubTeamSummary } from "../types";
import { DataViewContainer } from "../../../../../components/dataView";
import { ViewMode } from "../../../../../types/types";
import { offFieldDefinitions } from "../constants/fields";

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
        items={items.offRadarData ? [items.offRadarData] : []}
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

export default PiePlotAttack;
