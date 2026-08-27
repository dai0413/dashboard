import { ModelTableContainer } from "../../components/table";
import { useCompetition } from "../../context/models/competition";
import { ModelType } from "../../types/models";

const Competition = () => {
  const competitionContext = useCompetition();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"大会情報"}
        contextState={competitionContext}
        modelType={ModelType.COMPETITION}
      />
    </div>
  );
};

export default Competition;
