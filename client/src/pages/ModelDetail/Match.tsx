import { useMatch } from "../../context/models/match-context";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";

const Match = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.MATCH}
      modelType={ModelType.MATCH}
      modelContext={useMatch()}
      title="試合詳細"
    />
  );
};

export default Match;
