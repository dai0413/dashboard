import { useTeam } from "../../context/models/team";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const Team = () => {
  return (
    <Detail
      modelType={ModelType.TEAM}
      modelContext={useTeam()}
      title="チーム詳細"
    />
  );
};

export default Team;
