import { ModelTableContainer } from "../../components/table";
import { useStaff } from "../../context/models/staff";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const Staff = () => {
  const staffContext = useStaff();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"監督・コーチ情報"}
        contextState={staffContext}
        modelType={ModelType.STAFF}
        linkField={[
          {
            field: "name",
            to: APP_ROUTES.STAFF_SUMMARY,
          },
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
