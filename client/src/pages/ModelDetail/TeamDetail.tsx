import { useTeam } from "../../context/models/team-context";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const TeamDetail = () => {
  return (
    <Detail
      modelType={ModelType.TEAM}
      modelContext={useTeam()}
      title="チーム詳細"
    />
  );
};

export default TeamDetail;
