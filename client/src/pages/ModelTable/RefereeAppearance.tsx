import { ModelTableContainer } from "../../components/table";
import { useRefereeAppearance } from "../../context/models/referee-appearance";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ColumnType } from "../../types/table";

const RefereeAppearance = () => {
  const refereeAppearanceContext = useRefereeAppearance();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"審判の出場履歴"}
        headers={[
          {
            label: "試合",
            field: "match",
            type: ColumnType.FIELD,
            id: "match",
          },
          {
            label: "審判",
            field: "referee",
            type: ColumnType.FIELD,
            id: "referee",
          },
          { label: "役割", field: "role", type: ColumnType.FIELD, id: "role" },
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
