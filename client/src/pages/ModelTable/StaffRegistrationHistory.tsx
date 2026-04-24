import { ModelTableContainer } from "../../components/table";
import { useStaffRegistrationHistory } from "../../context/models/staff-registration-history";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const StaffRegistrationHistory = () => {
  const staffRegistrationHistoryContext = useStaffRegistrationHistory();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"スタッフ登録情報履歴"}
        contextState={staffRegistrationHistoryContext}
        modelType={ModelType.STAFF_REGISTRATION_HISTORY}
        linkField={[
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default StaffRegistrationHistory;
