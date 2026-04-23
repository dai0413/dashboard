import { ModelTableContainer } from "../../components/table";
import { useStaffAppearance } from "../../context/models/staff-appearance";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ColumnType } from "../../types/table";

const StaffAppearance = () => {
  const staffAppearanceContext = useStaffAppearance();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"スタッフの出場履歴"}
        headers={[
          {
            label: "試合",
            field: "match",
            type: ColumnType.FIELD,
            id: "match",
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
            label: "チーム",
            field: "team",
            type: ColumnType.FIELD,
            id: "team",
            defaultDisplay: true,
          },
          {
            label: "役割",
            field: "role",
            type: ColumnType.FIELD,
            id: "role",
            defaultDisplay: true,
          },
        ]}
        contextState={staffAppearanceContext}
        modelType={ModelType.STAFF_APPEARANCE}
        linkField={[
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
