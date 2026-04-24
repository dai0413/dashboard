import { ModelTableContainer } from "../../components/table";
import { usePlayerMatchEventLog } from "../../context/models/player-match-event-log";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const PlayerMatchEventLog = () => {
  const playerMatchEventLogContext = usePlayerMatchEventLog();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"選手の試合イベントログ"}
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
