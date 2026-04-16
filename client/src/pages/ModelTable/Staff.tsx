import { ModelTableContainer } from "../../components/table";
import { useStaff } from "../../context/models/staff";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { StaffGet } from "../../types/models/staff";
import { ColumnType } from "../../types/table";

const Staff = () => {
  const staffContext = useStaff();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"監督・コーチ情報"}
        headers={[
          { label: "名前", field: "name", type: ColumnType.FIELD, id: "name" },
          {
            label: "英名",
            field: "en_name",
            type: ColumnType.FIELD,
            id: "en_name",
          },
          {
            label: "生年月日",
            field: "dob",
            type: ColumnType.FIELD,
            id: "dob",
          },
          { label: "出身地", field: "pob", type: ColumnType.FIELD, id: "pob" },
          {
            label: "国籍",
            id: "citizenship",
            getData: (data: StaffGet) => {
              return data.citizenship?.map((c) => c.label).join(",") || "";
            },
            type: ColumnType.CUSTOM,
          },
          { label: "選手", field: "player", type: ColumnType.FIELD, id: "" },
        ]}
        contextState={staffContext}
        modelType={ModelType.STAFF}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default Staff;
