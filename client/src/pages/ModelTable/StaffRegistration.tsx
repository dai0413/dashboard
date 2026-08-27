import { ModelTableContainer } from "../../components/table";
import { useStaffRegistration } from "../../context/models/staff-registration";
import { ModelType } from "../../types/models";

const StaffRegistration = () => {
  const staffRegistrationContext = useStaffRegistration();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"スタッフ登録情報"}
        contextState={staffRegistrationContext}
        modelType={ModelType.STAFF_REGISTRATION}
      />
    </div>
  );
};

export default StaffRegistration;
