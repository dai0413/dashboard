import { useTransfer } from "../../context/models/transfer";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const Transfer = () => {
  return (
    <Detail
      modelType={ModelType.TRANSFER}
      modelContext={useTransfer()}
      title="移籍詳細"
    />
  );
};

export default Transfer;
