import { useCompetitionStage } from "../../context/models/competition-stage-context";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";

const CompetitionStageDetail = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.COMPETITION_STAGE}
      modelType={ModelType.COMPETITION_STAGE}
      modelContext={useCompetitionStage()}
      title="大会ステージ詳細"
    />
  );
};

export default CompetitionStageDetail;
