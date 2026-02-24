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
        headers={[
          { label: "試合", field: "match" },
          { label: "審判", field: "referee" },
          { label: "役割", field: "role" },
        ]}
        contextState={refereeAppearanceContext}
        modelType={ModelType.REFEREE_APPEARANCE}
        linkField={[
          {
            field: "match",
            to: APP_ROUTES.MATCH_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default RefereeAppearance;
