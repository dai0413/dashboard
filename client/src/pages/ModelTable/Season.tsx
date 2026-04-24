import { ModelTableContainer } from "../../components/table";
import { useSeason } from "../../context/models/season";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const Competition = () => {
  const seasonContext = useSeason();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"シーズン情報"}
        contextState={seasonContext}
        modelType={ModelType.SEASON}
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
