import { useInjury } from "../../context/models/injury-context";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const InjuryDetail = () => {
  return (
    <Detail
      modelType={ModelType.INJURY}
      modelContext={useInjury()}
      title="怪我詳細"
    />
  );
};

export default InjuryDetail;
