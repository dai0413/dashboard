import { useReferee } from "../../context/models/referee-context";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";

const RefereeDetail = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.REFEREE}
      modelType={ModelType.REFEREE}
      modelContext={useReferee()}
      title="審判詳細"
    />
  );
};

export default RefereeDetail;
