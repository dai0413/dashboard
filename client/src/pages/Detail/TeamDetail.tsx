import { useTeam } from "../../context/models/team-context";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";

const TeamDetail = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.TEAM}
      modelType={ModelType.TEAM}
      modelContext={useTeam()}
      title="怪我詳細"
    />
  );
};

export default TeamDetail;
