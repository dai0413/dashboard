import { ModelTableContainer } from "../../components/table";
import { useStaffRegistration } from "../../context/models/staff-registration";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ColumnType } from "../../types/table";

const StaffRegistration = () => {
  const staffRegistrationContext = useStaffRegistration();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"スタッフ登録情報"}
        headers={[
          {
            label: "大会",
            field: "competition",
            type: ColumnType.FIELD,
            id: "competition",
          },
          {
            label: "シーズン",
            field: "season",
            type: ColumnType.FIELD,
            id: "season",
          },
          { label: "日付", field: "date", type: ColumnType.FIELD, id: "date" },
          {
            label: "チーム",
            field: "team",
            type: ColumnType.FIELD,
            id: "team",
          },
          {
            label: "スタッフ",
            field: "staff",
            type: ColumnType.FIELD,
            id: "staff",
          },
          {
            label: "登録・抹消",
            field: "registration_type",
            type: ColumnType.FIELD,
            id: "registration_type",
          },
          {
            label: "状況",
            field: "registration_status",
            type: ColumnType.FIELD,
            id: "registration_status",
          },
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
