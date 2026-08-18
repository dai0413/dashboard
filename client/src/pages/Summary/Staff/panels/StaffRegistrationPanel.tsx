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
import { UseStaffSummary } from "../types";
import { StaffRegistrationGet } from "../../../../types/models/staff-registration";

const registrationFieldDefinition: UIFieldDefinition<
  GettedModelDataMap[ModelType.STAFF_REGISTRATION]
>[] = [
  ...convertFieldDefinition<StaffRegistrationGet>(
    ["season", "competition", "date", "team", "role", "registration_status"],
    fieldDefinition[ModelType.STAFF_REGISTRATION],
  ),
];

const StaffRegistrationPanel = ({ summary }: { summary: UseStaffSummary }) => {
  const {
    id,
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
        fieldDefinitions={registrationFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={registrationFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "staff")}
        sortField={registrationFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "staff")}
        initialData={{ formData: { staff: id } }}
        linkField={[
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
          { field: "competition", to: APP_ROUTES.COMPETITION_SUMMARY },
        ]}
      />
    </>
  );
};

export default StaffRegistrationPanel;
