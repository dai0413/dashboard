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
import { UseClubTeamSummary } from "../types";
import { playerField } from "../constants/field";

const preFutureinFieldDefinition = convertFieldDefinition<ModelType.TRANSFER>(
  ["from_date", "player", "from_team", "position"],
  fieldDefinition[ModelType.TRANSFER],
);

const futureInFieldDefinition: UIFieldDefinition<
  GettedModelDataMap[ModelType.TRANSFER]
>[] = [
  ...preFutureinFieldDefinition.filter((d) => d.key !== "player"),
  {
    ...preFutureinFieldDefinition.find((d) => d.key === "player"),
    ...playerField,
  },
];

const FurureInPanel = ({ summary }: { summary: UseClubTeamSummary }) => {
  const {
    id,
    panels: {
      future_in: { text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.TRANSFER}
        fieldDefinitions={futureInFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={futureInFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "to_team")}
        sortField={futureInFieldDefinition
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
          {
            field: "from_team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
      />
    </>
  );
};

export default FurureInPanel;
