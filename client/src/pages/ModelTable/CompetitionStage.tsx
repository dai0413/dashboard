import { ModelTableContainer } from "../../components/table";
import { useCompetitionStage } from "../../context/models/competition-stage";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const Competition = () => {
  const context = useCompetitionStage();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"大会ステージ情報"}
        contextState={context}
        modelType={ModelType.COMPETITION_STAGE}
        linkField={[
          {
            field: "competition",
            to: APP_ROUTES.COMPETITION_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default Competition;
