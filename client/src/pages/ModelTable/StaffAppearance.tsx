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
        contextState={staffAppearanceContext}
        modelType={ModelType.STAFF_APPEARANCE}
        linkField={[
          {
            field: "staff",
            to: APP_ROUTES.STAFF_SUMMARY,
          },
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
          {
            field: "match",
            to: APP_ROUTES.MATCH_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default StaffAppearance;
