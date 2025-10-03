import { usePlayer } from "../../context/models/player-context";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const PlayerDetail = () => {
  return (
    <Detail
      modelType={ModelType.PLAYER}
      modelContext={usePlayer()}
      title="選手詳細"
    />
  );
};

export default PlayerDetail;
