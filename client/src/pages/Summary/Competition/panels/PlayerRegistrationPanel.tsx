import { GettedModelDataMap, ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import {
  isFilterable,
  isSortable,
  UIFieldDefinition,
} from "../../../../types/field";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { UseCompetitionSummary } from "../types";
import { PlayerRegistrationGet } from "../../../../types/models/player-registration";
import { ColumnType } from "../../../../types/table";

const playerRegistrationFieldDefinition: UIFieldDefinition<
  GettedModelDataMap[ModelType.PLAYER_REGISTRATION]
>[] = [
  ...convertFieldDefinition<ModelType.PLAYER_REGISTRATION>(
    ["date", "team", "position_group", "number", "player"],
    fieldDefinition[ModelType.PLAYER_REGISTRATION],
  ),
  {
    label: "抹消",
    key: "registration_status",
    displayOnTable: true,
    getData: (data: PlayerRegistrationGet) => {
      if (data.registration_status === "抹消済み") return "済";
      return "";
    },
    width: "80px",
    getValueType: ColumnType.CUSTOM,
    type: "select",
  },
  {
    label: "2種特指",
    key: "special_type",
    displayOnTable: true,
    getData: (data: PlayerRegistrationGet) => {
      if (data.isSpecialDesignation) return "特別指定";
      if (data.isTypeTwo) return "2種";
      return "";
    },
    width: "100px",
    getValueType: ColumnType.CUSTOM,
    type: "string",
  },
];

const PlayerRegistrationPanel = ({
  summary,
}: {
  summary: UseCompetitionSummary;
}) => {
  const {
    panels: {
      playerRegistration: { text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.PLAYER_REGISTRATION_HISTORY}
        fieldDefinitions={playerRegistrationFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={playerRegistrationFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "competition")}
        sortField={playerRegistrationFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "competition")}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
      />
    </>
  );
};

export default PlayerRegistrationPanel;
