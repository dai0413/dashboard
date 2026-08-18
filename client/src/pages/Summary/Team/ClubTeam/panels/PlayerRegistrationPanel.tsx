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
import { ColumnType } from "../../../../../types/table";
import { UseClubTeamSummary } from "../types";
import { PlayerRegistrationGet } from "../../../../../types/models/player-registration";

const registrationFieldDefinition: UIFieldDefinition<
  GettedModelDataMap[ModelType.PLAYER_REGISTRATION]
>[] = [
  ...convertFieldDefinition<PlayerRegistrationGet>(
    ["season", "number", "player", "registration_status"],
    fieldDefinition[ModelType.PLAYER_REGISTRATION],
  ),
  {
    label: "2種・特別指定",
    key: "special_type",
    displayOnTable: true,
    getData: (data: PlayerRegistrationGet) => {
      if (data.isSpecialDesignation) return "特別指定";
      if (data.isTypeTwo) return "2種";
      return "";
    },
    getValueType: ColumnType.CUSTOM,
    type: "string",
  },
];

const PlayerRegistrationPanel = ({
  summary,
}: {
  summary: UseClubTeamSummary;
}) => {
  const {
    panels: {
      playerRegistration: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.PLAYER_REGISTRATION_HISTORY}
        fieldDefinitions={registrationFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={registrationFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "team")}
        sortField={registrationFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "team")}
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

export default PlayerRegistrationPanel;
