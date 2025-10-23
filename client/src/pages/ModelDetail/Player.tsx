import { usePlayer } from "../../context/models/player";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const Player = () => {
  return (
    <Detail
      modelType={ModelType.PLAYER}
      modelContext={usePlayer()}
      title="選手詳細"
    />
  );
};

export default Player;
