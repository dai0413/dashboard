import { ModelTableContainer } from "../../components/table";
import { useMatchEventType } from "../../context/models/match-event-type";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";

const MatchEventType = () => {
  const context = useMatchEventType();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"試合イベント情報"}
        contextState={context}
        modelType={ModelType.MATCH_EVENT_TYPE}
        linkField={[
          {
            field: "result",
            to: APP_ROUTES.MATCH_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default MatchEventType;
