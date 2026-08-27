import { ModelTableContainer } from "../../components/table";
import { useStaffAppearance } from "../../context/models/staff-appearance";
import { ModelType } from "../../types/models";

const StaffAppearance = () => {
  const staffAppearanceContext = useStaffAppearance();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"スタッフの出場履歴"}
        contextState={staffAppearanceContext}
        modelType={ModelType.STAFF_APPEARANCE}
      />
    </div>
  );
};

export default StaffAppearance;
