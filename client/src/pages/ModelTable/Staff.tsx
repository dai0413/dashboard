import { ModelTableContainer } from "../../components/table";
import { useStaff } from "../../context/models/staff";
import { ModelType } from "../../types/models";

const Staff = () => {
  const staffContext = useStaff();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"監督・コーチ情報"}
        contextState={staffContext}
        modelType={ModelType.STAFF}
      />
    </div>
  );
};

export default Staff;
