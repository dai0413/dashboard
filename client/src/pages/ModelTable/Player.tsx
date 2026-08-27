import { ModelTableContainer } from "../../components/table";
import { usePlayer } from "../../context/models/player";
import { ModelType } from "../../types/models";

const Player = () => {
  const playerContext = usePlayer();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"選手情報"}
        contextState={playerContext}
        modelType={ModelType.PLAYER}
      />
    </div>
  );
};

export default Player;
