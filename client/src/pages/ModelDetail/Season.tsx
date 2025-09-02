import { useSeason } from "../../context/models/season-context";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";

const Season = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.SEASON}
      modelType={ModelType.SEASON}
      modelContext={useSeason()}
      title="シーズン詳細"
    />
  );
};

export default Season;
