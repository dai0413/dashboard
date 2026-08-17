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

const registrationFieldDefinition: UIFieldDefinition<
  GettedModelDataMap[ModelType.STAFF_REGISTRATION]
>[] = [
  ...convertFieldDefinition<ModelType.STAFF_REGISTRATION>(
    ["season", "role", "staff", "registration_status"],
    fieldDefinition[ModelType.STAFF_REGISTRATION],
  ),
];

const StaffRegistrationPanel = ({
  summary,
}: {
  summary: UseClubTeamSummary;
}) => {
  const {
    panels: {
      staffRegistration: { text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.STAFF_REGISTRATION_HISTORY}
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
            field: "staff",
            to: APP_ROUTES.STAFF_SUMMARY,
          },
        ]}
      />
    </>
  );
};

export default StaffRegistrationPanel;
