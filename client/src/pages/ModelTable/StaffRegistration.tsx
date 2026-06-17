import { ModelTableContainer } from "../../components/table";
import { useStaffRegistration } from "../../context/models/staff-registration";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const StaffRegistration = () => {
  const staffRegistrationContext = useStaffRegistration();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"スタッフ登録情報"}
        contextState={staffRegistrationContext}
        modelType={ModelType.STAFF_REGISTRATION}
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
    </div>
  );
};

export default StaffRegistration;
