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
      <div className="text-gray-600">{text}</div>
      <DataViewContainer
        totalCount={items.playerStatistics.length}
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
            playerStatistics: items.playerStatistics,
            playerAppearance: items.playerAppearance,
            playerRegistrations: items.playerRegistrations,
            matches: items.matches,
            formationCounts: items.formationCounts,
          },
        }}
      />
    </>
  );
};

export default AppearancePlotPanel;
