import { useCompetitionStage } from "../../context/models/competition-stage-context";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const CompetitionStageDetail = () => {
  return (
    <Detail
      modelType={ModelType.COMPETITION_STAGE}
      modelContext={useCompetitionStage()}
      title="大会ステージ詳細"
    />
  );
};

export default CompetitionStageDetail;
