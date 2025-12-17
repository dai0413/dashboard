import { useStaff } from "../../context/models/staff";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const Staff = () => {
  return (
    <Detail
      modelType={ModelType.STAFF}
      modelContext={useStaff()}
      title="監督・コーチ詳細"
    />
  );
};

export default Staff;
