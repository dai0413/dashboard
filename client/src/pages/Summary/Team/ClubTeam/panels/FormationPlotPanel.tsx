import { TableClient } from "../../../../../components/dataView";
import { UseClubTeamSummary } from "../types";
import { ViewMode } from "../../../../../types/types";
import { ModelType } from "../../../../../types/models";
import { fieldDefinition } from "../../../../../lib/model-fields";

const formationPlotFieldDefinition =
  fieldDefinition[ModelType.TEAM_MATCH_FORMATION];

const FormationPlotPanel = ({ summary }: { summary: UseClubTeamSummary }) => {
  const {
    panels: {
      formationPlot: { text, items, isLoading, reloadFun },
    },
  } = summary;

  return (
    <>
      <h2 className="text-base font-semibold text-gray-800">{text}</h2>
      <TableClient
        totalCount={items.teamMatchFormations.length}
        reloadFun={async (filterConditions, sortConditions) =>
          await reloadFun(filterConditions, sortConditions)
        }
        itemsLoading={isLoading}
        fieldDefinitions={formationPlotFieldDefinition}
        viewModes={[ViewMode.POSITION_LIST, ViewMode.TABLE, ViewMode.TILE]}
        defaultViewMode={ViewMode.POSITION_LIST}
        viewData={{
          [ViewMode.TABLE]: items.teamMatchFormations,
          [ViewMode.TILE]: items.teamMatchFormations,
          [ViewMode.POSITION_LIST]: items.groupedPlayers,
        }}
        quickFilterItems={items.quickFilterDatas}
      />
    </>
  );
};

export default FormationPlotPanel;
