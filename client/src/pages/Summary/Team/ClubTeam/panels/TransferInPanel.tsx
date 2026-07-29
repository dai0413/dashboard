import { ModelType } from "../../../../../types/models";
import TableClient from "../../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../../types/field";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { UseClubTeamSummary } from "../types";

const transferInFieldDefinition = convertFieldDefinition<ModelType.TRANSFER>(
  ["from_date", "player", "from_team", "form"],
  fieldDefinition[ModelType.TRANSFER],
);

const TransferInPanel = ({ summary }: { summary: UseClubTeamSummary }) => {
  const {
    id,
    transfer_in: { text, key, items, reloadFun },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.TRANSFER}
        fieldDefinitions={transferInFieldDefinition}
        pageNum={1}
        items={items}
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
