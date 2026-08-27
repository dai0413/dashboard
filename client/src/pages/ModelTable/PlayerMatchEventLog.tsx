import { ModelTableContainer } from "../../components/table";
import { usePlayerMatchEventLog } from "../../context/models/player-match-event-log";
import { ModelType } from "../../types/models";

const PlayerMatchEventLog = () => {
  const playerMatchEventLogContext = usePlayerMatchEventLog();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"選手の試合イベントログ"}
        contextState={playerMatchEventLogContext}
        modelType={ModelType.PLAYER_MATCH_EVENT_LOG}
      />
    </div>
  );
};

export default PlayerMatchEventLog;
