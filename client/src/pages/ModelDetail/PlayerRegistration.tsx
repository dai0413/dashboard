import { usePlayerRegistration } from "../../context/models/player-registration";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const PlayerRegistration = () => {
  return (
    <Detail
      modelType={ModelType.PLAYER_REGISTRATION}
      modelContext={usePlayerRegistration()}
      title="選手登録詳細"
    />
  );
};

export default PlayerRegistration;
