import { ModelTableContainer } from "../../components/table";
import { useReferee } from "../../context/models/referee";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";

const Referee = () => {
  const RefereeContext = useReferee();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"審判情報"}
        contextState={RefereeContext}
        modelType={ModelType.REFEREE}
        linkField={[
          {
            field: "name",
            to: APP_ROUTES.REFEREE_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default Referee;
