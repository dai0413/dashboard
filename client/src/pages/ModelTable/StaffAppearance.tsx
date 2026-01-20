import { ModelTableContainer } from "../../components/table";
import { useStaffAppearance } from "../../context/models/staff-appearance";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const StaffAppearance = () => {
  const staffAppearanceContext = useStaffAppearance();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"スタッフの出場履歴"}
        headers={[
          { label: "試合", field: "match" },
          { label: "スタッフ", field: "staff" },
          { label: "チーム", field: "team" },
          { label: "役割", field: "role" },
        ]}
        contextState={staffAppearanceContext}
        modelType={ModelType.STAFF_APPEARANCE}
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

export default StaffAppearance;
