import { usePlayer } from "../../context/models/player-context";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";

const Player = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.PLAYER}
      modelType={ModelType.PLAYER}
      modelContext={usePlayer()}
      title="選手詳細"
    />
  );
};

export default Player;
