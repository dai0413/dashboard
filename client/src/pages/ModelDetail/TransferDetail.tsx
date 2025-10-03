import { useTransfer } from "../../context/models/transfer-context";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const TransferDetail = () => {
  return (
    <Detail
      modelType={ModelType.TRANSFER}
      modelContext={useTransfer()}
      title="移籍詳細"
    />
  );
};

export default TransferDetail;
