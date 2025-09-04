import { useTransfer } from "../../context/models/transfer-context";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";

const Transfer = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.TRANSFER}
      modelType={ModelType.TRANSFER}
      modelContext={useTransfer()}
      title="移籍詳細"
    />
  );
};

export default Transfer;
