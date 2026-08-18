import { ModelType } from "../../../../../types/models";
import TableClient from "../../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../../types/field";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { UseNationalTeamSummary } from "../types";
import { PlayerGet } from "../../../../../types/models/player";

const playerFieldDefinition = convertFieldDefinition<PlayerGet>(
  ["name", "dob"],
  fieldDefinition[ModelType.PLAYER],
);

const PlayerPanel = ({ summary }: { summary: UseNationalTeamSummary }) => {
  const {
    panels: {
      player: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.PLAYER}
        fieldDefinitions={playerFieldDefinition}
        pageNum={1}
        items={items}
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
