import { useInjury } from "../../context/models/injury-context";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";

const Injury = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.INJURY}
      modelType={ModelType.INJURY}
      modelContext={useInjury()}
      title="怪我詳細"
    />
  );
};

export default Injury;
