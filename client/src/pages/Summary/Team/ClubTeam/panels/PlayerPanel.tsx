import { GettedModelDataMap, ModelType } from "../../../../../types/models";
import TableClient from "../../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../../lib/model-fields";
import {
  isFilterable,
  isSortable,
  UIFieldDefinition,
} from "../../../../../types/field";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { playerField } from "../constants/field";
import { UseClubTeamSummary } from "../types";

const prePlayerFieldDefinition = convertFieldDefinition<ModelType.TRANSFER>(
  ["position", "player", "from_date", "form"],
  fieldDefinition[ModelType.TRANSFER],
);

const playerFieldDefinition: UIFieldDefinition<
  GettedModelDataMap[ModelType.TRANSFER]
>[] = [
  ...prePlayerFieldDefinition.filter((d) => d.key !== "player"),
  {
    ...prePlayerFieldDefinition.find((d) => d.key === "player"),
    ...playerField,
  },
];

const PlayerPanel = ({ summary }: { summary: UseClubTeamSummary }) => {
  const {
    id,
    panels: {
      player: { text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.TRANSFER}
        fieldDefinitions={playerFieldDefinition || []}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={playerFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "to_team")}
        sortField={playerFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "to_team")}
        initialData={{
          formData: { to_team: id },
          metaData: { team: id },
        }}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
        ]}
      />
    </>
  );
};

export default PlayerPanel;
