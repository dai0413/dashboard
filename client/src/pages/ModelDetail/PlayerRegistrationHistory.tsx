import { usePlayerRegistrationHistory } from "../../context/models/player-registration-history";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const PlayerRegistrationHistory = () => {
  return (
    <Detail
      modelType={ModelType.PLAYER_REGISTRATION_HISTORY}
      modelContext={usePlayerRegistrationHistory()}
      title="選手登録履歴詳細"
    />
  );
};

export default PlayerRegistrationHistory;
