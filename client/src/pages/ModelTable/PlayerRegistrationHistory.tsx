import { ModelTableContainer } from "../../components/table";
import { usePlayerRegistrationHistory } from "../../context/models/player-registration-history";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const PlayerRegistrationHistory = () => {
  const playerRegistrationHistoryContext = usePlayerRegistrationHistory();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"選手登録情報履歴"}
        contextState={playerRegistrationHistoryContext}
        modelType={ModelType.PLAYER_REGISTRATION_HISTORY}
        linkField={[
          {
            field: "competition",
            to: APP_ROUTES.COMPETITION_SUMMARY,
          },
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default PlayerRegistrationHistory;
