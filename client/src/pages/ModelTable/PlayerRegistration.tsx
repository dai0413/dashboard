import { ModelTableContainer } from "../../components/table";
import { usePlayerRegistration } from "../../context/models/player-registration";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const PlayerRegistration = () => {
  const playerRegistrationContext = usePlayerRegistration();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"選手登録情報"}
        contextState={playerRegistrationContext}
        modelType={ModelType.PLAYER_REGISTRATION}
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

export default PlayerRegistration;
