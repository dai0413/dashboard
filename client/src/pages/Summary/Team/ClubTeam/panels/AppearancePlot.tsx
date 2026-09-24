import { UseClubTeamSummary } from "../types";
import { DataViewContainer } from "../../../../../components/dataView";
import { MatchMatrix } from "../../../../../components/dataView/DataViewContent/DataView/Matrix";
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
        fieldDefinitions={[]}
        items={items.playerStatistics}
        totalCount={items.playerStatistics.length}
        filterField={[]}
        sortField={[]}
        reloadFun={async (filterConditions, sortConditions) =>
          await reloadFun(filterConditions, sortConditions)
        }
        handleFilterSort={async (filterConditions, sortConditions) => {
          await reloadFun(filterConditions, sortConditions);
        }}
        renderView={() => (
          <MatchMatrix
            teamId={id}
            playerStatistics={items.playerStatistics}
            playerAppearance={items.playerAppearance}
            playerRegistrations={items.playerRegistrations}
            matches={items.matches}
            formationCounts={items.formationCounts}
          />
        )}
        itemsLoading={isLoading}
        viewModes={[ViewMode.MATRIX]}
        defaultViewMode={ViewMode.MATRIX}
        viewData={
          {
            // [ViewMode.MATRIX]: ,
          }
        }
      />
    </>
  );
};

export default AppearancePlotPanel;
