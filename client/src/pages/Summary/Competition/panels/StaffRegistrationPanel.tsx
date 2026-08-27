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
import { ColumnType } from "../../../../types/table";
import { StaffRegistrationGet } from "../../../../types/models/staff-registration";

const staffRegistrationFieldDefinition: UIFieldDefinition<
  GettedModelDataMap[ModelType.STAFF_REGISTRATION]
>[] = [
  ...convertFieldDefinition<StaffRegistrationGet>(
    ["date", "team", "role", "staff"],
    fieldDefinition[ModelType.STAFF_REGISTRATION],
  ),
  {
    label: "抹消",
    key: "registration_status",
    displayOnTable: true,
    getData: (data: StaffRegistrationGet) => {
      if (data.registration_status === "抹消済み") return { label: "済" };
      return { label: "" };
    },
    getValueType: ColumnType.CUSTOM,
    type: "select",
  },
];

const StaffRegistrationPanel = ({
  summary,
}: {
  summary: UseCompetitionSummary;
}) => {
  const {
    panels: {
      staffRegistration: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.STAFF_REGISTRATION}
        fieldDefinitions={staffRegistrationFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={staffRegistrationFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "competition")}
        sortField={staffRegistrationFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "competition")}
        linkField={[
          {
            field: "staff",
            to: APP_ROUTES.STAFF_SUMMARY,
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

export default StaffRegistrationPanel;
