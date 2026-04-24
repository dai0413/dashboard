import { ModelTableContainer } from "../../components/table";
import { useMatchFormat } from "../../context/models/match-format";
import { ModelType } from "../../types/models";

const MatchFormat = () => {
  const context = useMatchFormat();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"試合フォーマット情報"}
        contextState={context}
        modelType={ModelType.MATCH_FORMAT}
      />
    </div>
  );
};

export default MatchFormat;
