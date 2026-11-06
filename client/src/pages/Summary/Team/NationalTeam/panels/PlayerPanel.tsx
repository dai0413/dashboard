import { ModelType } from "../../../../../types/models";
import { TableClient } from "../../../../../components/dataView";
import { convertFieldDefinition } from "../../../../../utils/displayField/convertFieldDefinition";
import { isFilterable, isSortable } from "../../../../../types/field";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { UseNationalTeamSummary } from "../types";
import { ViewMode } from "../../../../../types/types";

const playerFieldDefinition = convertFieldDefinition({
  keys: ["name", "dob"],
  getFieldsKey: ModelType.PLAYER,
});

const PlayerPanel = ({ summary }: { summary: UseNationalTeamSummary }) => {
  const {
    panels: {
      player: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <h2 className="text-base font-semibold text-gray-800">{text}</h2>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.PLAYER}
        fieldDefinitions={playerFieldDefinition}
        viewModes={[ViewMode.TABLE, ViewMode.TILE]}
        viewData={{ [ViewMode.TABLE]: items, [ViewMode.TILE]: items }}
        totalCount={items.length}
        reloadFun={reloadFun}
        filterField={playerFieldDefinition?.filter(isFilterable)}
        sortField={playerFieldDefinition?.filter(isSortable)}
        linkField={[
          {
            field: "name",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
        ]}
      />
    </>
  );
};

export default PlayerPanel;
