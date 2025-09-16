import { useMatchFormat } from "../../context/models/match-format";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";

const MatchFormat = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.MATCH_FORMAT}
      modelType={ModelType.MATCH_FORMAT}
      modelContext={useMatchFormat()}
      title="試合フォーマット詳細"
    />
  );
};

export default MatchFormat;
