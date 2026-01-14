import { ModelTableContainer } from "../../components/table";
import { useMatchEventType } from "../../context/models/match-event-type";
import { ModelType } from "../../types/models";

const MatchEventType = () => {
  const context = useMatchEventType();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"試合イベント情報"}
        headers={[
          { label: "名前", field: "name" },
          { label: "英名", field: "en_name" },
          { label: "略称", field: "abbr" },
          { label: "イベントタイプ", field: "event_type" },
        ]}
        contextState={context}
        modelType={ModelType.MATCH_EVENT_TYPE}
      />
    </div>
  );
};

export default MatchEventType;
