import { UseClubTeamSummary } from "../types";
import { DataViewContainer } from "../../../../../components/dataView";
import { ViewMode } from "../../../../../types/types";

const AppearancePlotPanel = ({ summary }: { summary: UseClubTeamSummary }) => {
  const {
    id,
    panels: {
      appearancePlot: { text, items, reloadFun, isLoading },
    },
  } = summary;

  return (
    <>
      <h2 className="text-base font-semibold text-gray-800">{text}</h2>
      <DataViewContainer
        totalCount={items.groupedPlayers.length}
        reloadFun={async (filterConditions, sortConditions) =>
          await reloadFun(filterConditions, sortConditions)
        }
        handleFilterSort={async (filterConditions, sortConditions) => {
          await reloadFun(filterConditions, sortConditions);
        }}
        itemsLoading={isLoading}
        viewModes={[ViewMode.MATCH_MATRIX]}
        defaultViewMode={ViewMode.MATCH_MATRIX}
        viewData={{
          [ViewMode.MATCH_MATRIX]: {
            teamId: id,
            ...items,
          },
        }}
        quickFilterItems={items.quickFilterDatas}
      />
    </>
  );
};

export default AppearancePlotPanel;
