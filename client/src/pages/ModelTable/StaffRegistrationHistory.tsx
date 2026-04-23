import { ModelTableContainer } from "../../components/table";
import { useStaffRegistrationHistory } from "../../context/models/staff-registration-history";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ColumnType } from "../../types/table";

const StaffRegistrationHistory = () => {
  const staffRegistrationHistoryContext = useStaffRegistrationHistory();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"スタッフ登録情報履歴"}
        headers={[
          {
            label: "大会",
            field: "competition",
            type: ColumnType.FIELD,
            id: "competition",
            defaultDisplay: true,
          },
          {
            label: "シーズン",
            field: "season",
            type: ColumnType.FIELD,
            id: "season",
            defaultDisplay: true,
          },
          {
            label: "日付",
            field: "date",
            type: ColumnType.FIELD,
            id: "date",
            defaultDisplay: true,
          },
          {
            label: "チーム",
            field: "team",
            type: ColumnType.FIELD,
            id: "team",
            defaultDisplay: true,
          },
          {
            label: "スタッフ",
            field: "staff",
            type: ColumnType.FIELD,
            id: "staff",
            defaultDisplay: true,
          },
          {
            label: "役割",
            id: "changes.role",
            defaultDisplay: true,
            getData: (data) => {
              let base: string = "";
              if (data.registration_type === "変更") {
                base = "変更後→→→";
              }
              return data.changes?.role ? `${base}${data.changes.role}` : "";
            },
            type: ColumnType.CUSTOM,
          },
          {
            label: "登録・抹消",
            field: "registration_type",
            type: ColumnType.FIELD,
            id: "registration_type",
            defaultDisplay: true,
          },
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
