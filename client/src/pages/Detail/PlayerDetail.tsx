import { usePlayer } from "../../context/player-context";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";

const PlayerDetail = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.PLAYER}
      modelContext={usePlayer()}
      title="選手詳細"
    />
  );
};

export default PlayerDetail;
