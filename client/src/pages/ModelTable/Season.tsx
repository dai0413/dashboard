import { ModelTableContainer } from "../../components/table";
import { useSeason } from "../../context/models/season";
import { ModelType } from "../../types/models";

const Competition = () => {
  const seasonContext = useSeason();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"シーズン情報"}
        contextState={seasonContext}
        modelType={ModelType.SEASON}
      />
    </div>
  );
};

export default Competition;
