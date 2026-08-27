import { ModelTableContainer } from "../../components/table";
import { usePlayerRegistrationHistory } from "../../context/models/player-registration-history";
import { ModelType } from "../../types/models";

const PlayerRegistrationHistory = () => {
  const playerRegistrationHistoryContext = usePlayerRegistrationHistory();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"選手登録情報履歴"}
        contextState={playerRegistrationHistoryContext}
        modelType={ModelType.PLAYER_REGISTRATION_HISTORY}
      />
    </div>
  );
};

export default PlayerRegistrationHistory;
