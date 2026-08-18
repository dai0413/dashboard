import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import {
  isFilterable,
  isSortable,
  UIFieldDefinition,
} from "../../../../types/field";
import { UsePlayerSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { PlayerRegistrationGet } from "../../../../types/models/player-registration";
import { ColumnType } from "../../../../types/table";

const playerRegistrationFieldDefinition: UIFieldDefinition<PlayerRegistrationGet>[] =
  [
    ...convertFieldDefinition<PlayerRegistrationGet>(
      [
        "season",
        "competition",
        "date",
        "team",
        "registration_type",
        "registration_status",
      ],
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
  summary: UsePlayerSummary;
}) => {
  const {
    id,
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
          .filter((file) => file.key !== "player")}
        sortField={playerRegistrationFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "player")}
        linkField={[
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
          { field: "competition", to: APP_ROUTES.COMPETITION_SUMMARY },
        ]}
        initialData={{ formData: { player: id } }}
      />
    </>
  );
};

export default PlayerRegistrationPanel;
