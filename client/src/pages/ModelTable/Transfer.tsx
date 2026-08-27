import { ModelTableContainer } from "../../components/table";
import { useTransfer } from "../../context/models/transfer";
import { ModelType } from "../../types/models";

const Transfer = () => {
  const transferContext = useTransfer();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"移籍情報"}
        contextState={transferContext}
        modelType={ModelType.TRANSFER}
      />
    </div>
  );
};

export default Transfer;
