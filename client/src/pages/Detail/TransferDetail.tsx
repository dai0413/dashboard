import { useTransfer } from "../../context/transfer-context";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";

const TransferDetail = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.TRANSFER}
      modelContext={useTransfer()}
      title="移籍詳細"
    />
  );
};

export default TransferDetail;
