import { useCompetition } from "../../context/models/competition-context";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";

const CompetitionDetail = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.COMPETITION}
      modelType={ModelType.COMPETITION}
      modelContext={useCompetition()}
      title="大会詳細"
    />
  );
};

export default CompetitionDetail;
