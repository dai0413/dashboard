import { ModelTableContainer } from "../../components/table";
import { useMatchEventType } from "../../context/models/match-event-type";
import { ModelType } from "../../types/models";

const MatchEventType = () => {
  const context = useMatchEventType();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"試合イベント情報"}
        contextState={context}
        modelType={ModelType.MATCH_EVENT_TYPE}
      />
    </div>
  );
};

export default MatchEventType;
