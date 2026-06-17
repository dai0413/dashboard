import { ModelTableContainer } from "../../components/table";
import { useRefereeAppearance } from "../../context/models/referee-appearance";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const RefereeAppearance = () => {
  const refereeAppearanceContext = useRefereeAppearance();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"審判の出場履歴"}
        contextState={refereeAppearanceContext}
        modelType={ModelType.REFEREE_APPEARANCE}
        linkField={[
          {
            field: "match",
            to: APP_ROUTES.MATCH_SUMMARY,
          },
          {
            field: "referee",
            to: APP_ROUTES.REFEREE_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default RefereeAppearance;
