import { ModelTableContainer } from "../../components/dataView";
import { useCompetitionStage } from "../../context/models/competition-stage";
import { ModelType } from "../../types/models";

const Competition = () => {
  const context = useCompetitionStage();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"大会ステージ情報"}
        contextState={context}
        modelType={ModelType.COMPETITION_STAGE}
      />
    </div>
  );
};

export default Competition;
