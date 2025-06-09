import { useInjury } from "../../context/injury-context";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";

const InjuryDetail = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.INJURY}
      modelContext={useInjury()}
      title="怪我詳細"
    />
  );
};

export default InjuryDetail;
