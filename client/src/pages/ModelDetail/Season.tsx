import { useSeason } from "../../context/models/season";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const Season = () => {
  return (
    <Detail
      modelType={ModelType.SEASON}
      modelContext={useSeason()}
      title="シーズン詳細"
    />
  );
};

export default Season;
