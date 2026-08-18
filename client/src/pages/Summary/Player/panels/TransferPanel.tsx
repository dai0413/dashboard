import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../types/field";
import { UsePlayerSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { TransferGet } from "../../../../types/models/transfer";

const transferFieldDefinition = convertFieldDefinition<TransferGet>(
  ["from_date", "from_team", "to_team", "form"],
  fieldDefinition[ModelType.TRANSFER],
);

const TransferPanel = ({ summary }: { summary: UsePlayerSummary }) => {
  const {
    id,
    panels: {
      transfer: { text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.TRANSFER}
        fieldDefinitions={transferFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={transferFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "player")}
        sortField={transferFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "player")}
        linkField={[
          {
            field: "from_team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
          {
            field: "to_team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
        initialData={{ formData: { player: id } }}
      />
    </>
  );
};

export default TransferPanel;
