import { ModelTableContainer } from "../../components/table";
import { useMatchEventType } from "../../context/models/match-event-type";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";
import { ColumnType } from "../../types/table";

const MatchEventType = () => {
  const context = useMatchEventType();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"試合イベント情報"}
        headers={[
          { label: "名前", field: "name", type: ColumnType.FIELD, id: "name" },
          {
            label: "英名",
            field: "en_name",
            type: ColumnType.FIELD,
            id: "en_name",
          },
          { label: "略称", field: "abbr", type: ColumnType.FIELD, id: "abbr" },
          {
            label: "イベントタイプ",
            field: "event_type",
            type: ColumnType.FIELD,
            id: "event_type",
          },
        ]}
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
