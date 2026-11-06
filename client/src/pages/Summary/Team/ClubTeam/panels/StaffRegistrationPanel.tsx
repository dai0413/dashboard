import { ModelType } from "../../../../../types/models";
import { TableClient } from "../../../../../components/dataView";
import { convertFieldDefinition } from "../../../../../utils/displayField/convertFieldDefinition";
import { UIFieldDefinition } from "../../../../../types/field";
import { isFilterable, isSortable } from "../../../../../utils/data-field";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { UseClubTeamSummary } from "../types";
import { StaffRegistrationGet } from "../../../../../types/models/staff-registration";
import { ViewMode } from "../../../../../types/types";

const registrationFieldDefinition: UIFieldDefinition<StaffRegistrationGet>[] = [
  ...convertFieldDefinition({
    keys: ["season", "role", "staff", "registration_status"],
    getFieldsKey: ModelType.STAFF_REGISTRATION,
  }),
];

const StaffRegistrationPanel = ({
  summary,
}: {
  summary: UseClubTeamSummary;
}) => {
  const {
    panels: {
      staffRegistration: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <h2 className="text-base font-semibold text-gray-800">{text}</h2>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.STAFF_REGISTRATION}
        fieldDefinitions={registrationFieldDefinition}
        viewModes={[ViewMode.TABLE, ViewMode.TILE]}
        viewData={{ [ViewMode.TABLE]: items, [ViewMode.TILE]: items }}
        totalCount={items.length}
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
