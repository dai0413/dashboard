import { ModelTableContainer } from "../../components/table";
import { useInjury } from "../../context/models/injury";
import { ModelType } from "../../types/models";

const Injury = () => {
  const injuryContext = useInjury();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"負傷情報"}
        contextState={injuryContext}
        modelType={ModelType.INJURY}
      />
    </div>
  );
};

export default Injury;
