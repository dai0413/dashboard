import { useCompetition } from "../../context/models/competition-context";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const CompetitionDetail = () => {
  return (
    <Detail
      modelType={ModelType.COMPETITION}
      modelContext={useCompetition()}
      title="大会詳細"
    />
  );
};

export default CompetitionDetail;
