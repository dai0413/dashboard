import { ModelTableContainer } from "../../components/table";
import { useStaff } from "../../context/models/staff";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { StaffGet } from "../../types/models/staff";

const Staff = () => {
  const staffContext = useStaff();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"監督・コーチ情報"}
        headers={[
          { label: "名前", field: "name" },
          { label: "英名", field: "en_name" },
          { label: "生年月日", field: "dob" },
          { label: "出身地", field: "pob" },
          {
            label: "国籍",
            field: "citizenship",
            getData: (data: StaffGet) => {
              return data.citizenship?.map((c) => c.label).join(",") || "";
            },
          },
          { label: "選手", field: "player" },
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
