import { ModelType } from "../../../../../types/models";
import TableClient from "../../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../../types/field";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { UseClubTeamSummary } from "../types";
import { TransferGet } from "../../../../../types/models/transfer";

const transferOutFieldDefinition = convertFieldDefinition<TransferGet>(
  ["from_date", "player", "to_team", "form"],
  fieldDefinition[ModelType.TRANSFER],
);

const TransferOutPanel = ({ summary }: { summary: UseClubTeamSummary }) => {
  const {
    id,
    panels: {
      transfer_out: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.TRANSFER}
        fieldDefinitions={transferOutFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={transferOutFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "from_team")}
        sortField={transferOutFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "from_team")}
        initialData={{ formData: { from_team: id } }}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
          {
            field: "to_team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
      />
    </>
  );
};

export default TransferOutPanel;
