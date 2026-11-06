import { ModelType } from "../../../../../types/models";
import { TableClient } from "../../../../../components/dataView";
import { convertFieldDefinition } from "../../../../../utils/displayField/convertFieldDefinition";
import { isFilterable, isSortable } from "../../../../../types/field";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { UseClubTeamSummary } from "../types";
import { ViewMode } from "../../../../../types/types";

const transferInFieldDefinition = convertFieldDefinition({
  keys: ["from_date", "player", "from_team", "form"],
  getFieldsKey: ModelType.TRANSFER,
});

const TransferInPanel = ({ summary }: { summary: UseClubTeamSummary }) => {
  const {
    id,
    panels: {
      transfer_in: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <h2 className="text-base font-semibold text-gray-800">{text}</h2>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.TRANSFER}
        fieldDefinitions={transferInFieldDefinition}
        viewModes={[ViewMode.TABLE, ViewMode.TILE]}
        viewData={{ [ViewMode.TABLE]: items, [ViewMode.TILE]: items }}
        totalCount={items.length}
        reloadFun={reloadFun}
        filterField={transferInFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "to_team")}
        sortField={transferInFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "to_team")}
        initialData={{ formData: { to_team: id } }}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
          {
            field: "from_team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
      />
    </>
  );
};

export default TransferInPanel;
