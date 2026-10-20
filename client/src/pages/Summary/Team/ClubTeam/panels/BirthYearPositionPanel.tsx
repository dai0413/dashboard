import { UseClubTeamSummary } from "../types";
import { DataViewContainer } from "../../../../../components/dataView";
import { ViewMode } from "../../../../../types/types";

const BirthYearPositionPanel = ({
  summary,
}: {
  summary: UseClubTeamSummary;
}) => {
  const {
    id,
    panels: {
      birthYearPositionMatrix: { text, items, reloadFun, isLoading },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <DataViewContainer
        totalCount={items.groupedPlayers.length}
        reloadFun={async (filterConditions, sortConditions) =>
          await reloadFun(filterConditions, sortConditions)
        }
        handleFilterSort={async (filterConditions, sortConditions) => {
          await reloadFun(filterConditions, sortConditions);
        }}
        itemsLoading={isLoading}
        viewModes={[ViewMode.BIRTH_YEAR_POSITION_MATRIX]}
        defaultViewMode={ViewMode.BIRTH_YEAR_POSITION_MATRIX}
        viewData={{
          [ViewMode.BIRTH_YEAR_POSITION_MATRIX]: {
            teamId: id,
            ...items,
          },
        }}
        quickFilterItems={items.quickFilterDatas}
      />
    </>
  );
};

export default BirthYearPositionPanel;
