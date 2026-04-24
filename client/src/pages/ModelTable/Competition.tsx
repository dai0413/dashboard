import { ModelTableContainer } from "../../components/table";
import { useCompetition } from "../../context/models/competition";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const Competition = () => {
  const competitionContext = useCompetition();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"大会情報"}
        contextState={competitionContext}
        modelType={ModelType.COMPETITION}
        linkField={[
          {
            field: "name",
            to: APP_ROUTES.COMPETITION_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default Competition;
