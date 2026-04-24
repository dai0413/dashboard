import { ModelTableContainer } from "../../components/table";
import { useInjury } from "../../context/models/injury";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const Injury = () => {
  const injuryContext = useInjury();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"負傷情報"}
        contextState={injuryContext}
        modelType={ModelType.INJURY}
        linkField={[
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default Injury;
