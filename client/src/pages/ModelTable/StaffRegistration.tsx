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
        headers={[
          { label: "大会", field: "competition" },
          { label: "シーズン", field: "season" },
          { label: "日付", field: "date" },
          { label: "チーム", field: "team" },
          { label: "スタッフ", field: "staff" },
          { label: "登録・抹消", field: "registration_type" },
          { label: "状況", field: "registration_status" },
        ]}
        contextState={staffRegistrationContext}
        modelType={ModelType.STAFF_REGISTRATION}
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

export default StaffRegistration;
