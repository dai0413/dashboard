import { ModelTableContainer } from "../../components/table";
import { useRefereeAppearance } from "../../context/models/referee-appearance";
import { ModelType } from "../../types/models";

const RefereeAppearance = () => {
  const refereeAppearanceContext = useRefereeAppearance();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"審判の出場履歴"}
        contextState={refereeAppearanceContext}
        modelType={ModelType.REFEREE_APPEARANCE}
      />
    </div>
  );
};

export default RefereeAppearance;
