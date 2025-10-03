import { useMatchFormat } from "../../context/models/match-format";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const MatchFormat = () => {
  return (
    <Detail
      modelType={ModelType.MATCH_FORMAT}
      modelContext={useMatchFormat()}
      title="試合フォーマット詳細"
    />
  );
};

export default MatchFormat;
