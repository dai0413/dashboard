import { useStadium } from "../../context/models/stadium-context";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";

const Stadium = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.STADIUM}
      modelType={ModelType.STADIUM}
      modelContext={useStadium()}
      title="スタジアム詳細"
    />
  );
};

export default Stadium;
