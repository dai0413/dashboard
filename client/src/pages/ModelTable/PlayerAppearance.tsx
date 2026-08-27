import { ModelTableContainer } from "../../components/table";
import { usePlayerAppearance } from "../../context/models/player-appearance";
import { ModelType } from "../../types/models";

const PlayerAppearance = () => {
  const playerAppearanceContext = usePlayerAppearance();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"選手の出場履歴"}
        contextState={playerAppearanceContext}
        modelType={ModelType.PLAYER_APPEARANCE}
      />
    </div>
  );
};

export default PlayerAppearance;
