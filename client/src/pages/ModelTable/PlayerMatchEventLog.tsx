import { ModelTableContainer } from "../../components/table";
import { usePlayerMatchEventLog } from "../../context/models/player-match-event-log";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ColumnType } from "../../types/table";

const PlayerMatchEventLog = () => {
  const playerMatchEventLogContext = usePlayerMatchEventLog();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"選手の試合イベントログ"}
        headers={[
          {
            label: "試合",
            field: "match",
            type: ColumnType.FIELD,
            id: "match",
          },
          {
            label: "チーム",
            field: "team",
            type: ColumnType.FIELD,
            id: "team",
          },
          {
            label: "イベントタイプ",
            field: "match_event_type",
            type: ColumnType.FIELD,
            id: "match_event_type",
          },
          {
            label: "選手",
            field: "player",
            type: ColumnType.FIELD,
            id: "player",
          },
          {
            label: "前後半",
            field: "period_label",
            type: ColumnType.FIELD,
            id: "period_label",
          },
          {
            label: "時間",
            field: "time_name",
            type: ColumnType.FIELD,
            id: "time_name",
          },
          {
            label: "特別時間",
            field: "special_time",
            type: ColumnType.FIELD,
            id: "special_time",
          },
        ]}
        contextState={playerMatchEventLogContext}
        modelType={ModelType.PLAYER_MATCH_EVENT_LOG}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
          {
            field: "match",
            to: APP_ROUTES.MATCH_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default PlayerMatchEventLog;
