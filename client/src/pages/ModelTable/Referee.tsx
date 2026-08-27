import { ModelTableContainer } from "../../components/table";
import { useReferee } from "../../context/models/referee";
import { ModelType } from "../../types/models";

const Referee = () => {
  const RefereeContext = useReferee();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"審判情報"}
        contextState={RefereeContext}
        modelType={ModelType.REFEREE}
      />
    </div>
  );
};

export default Referee;
