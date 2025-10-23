import { useMatch } from "../../context/models/match";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const Match = () => {
  return (
    <Detail
      modelType={ModelType.MATCH}
      modelContext={useMatch()}
      title="試合詳細"
    />
  );
};

export default Match;
