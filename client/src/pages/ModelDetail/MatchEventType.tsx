import { useMatchEventType } from "../../context/models/match-event-type";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const MatchEuseMatchEventType = () => {
  return (
    <Detail
      modelType={ModelType.MATCH_EVENT_TYPE}
      modelContext={useMatchEventType()}
      title="試合イベント詳細"
    />
  );
};

export default MatchEuseMatchEventType;
