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
        headers={[
          { label: "大会", field: "competition" },
          { label: "シーズン", field: "season" },
          { label: "日付", field: "date" },
          { label: "チーム", field: "team" },
          { label: "スタッフ", field: "staff" },
          {
            label: "役割",
            field: "changes.role",
            getData: (data) => {
              let base: string = "";
              if (data.registration_type === "変更") {
                base = "変更後→→→";
              }
              return data.changes.role ? `${base}${data.changes.role}` : "";
            },
          },
          { label: "登録・抹消", field: "registration_type" },
          { label: "状況", field: "registration_status" },
        ]}
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
