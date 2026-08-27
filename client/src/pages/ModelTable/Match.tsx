import { ModelTableContainer } from "../../components/table";
import { useMatch } from "../../context/models/match";
import { ModelType } from "../../types/models";

const Match = () => {
  const context = useMatch();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"試合情報"}
        contextState={context}
        modelType={ModelType.MATCH}
      />
    </div>
  );
};

export default Match;
