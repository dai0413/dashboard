import { ModelTableContainer } from "../../components/table";
import { usePlayerRegistration } from "../../context/models/player-registration";
import { ModelType } from "../../types/models";

const PlayerRegistration = () => {
  const playerRegistrationContext = usePlayerRegistration();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"選手登録情報"}
        contextState={playerRegistrationContext}
        modelType={ModelType.PLAYER_REGISTRATION}
      />
    </div>
  );
};

export default PlayerRegistration;
