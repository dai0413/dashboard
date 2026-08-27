import { ModelTableContainer } from "../../components/table";
import { useTeam } from "../../context/models/team";
import { ModelType } from "../../types/models";

const Team = () => {
  const teamContext = useTeam();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"チーム情報"}
        contextState={teamContext}
        modelType={ModelType.TEAM}
      />
    </div>
  );
};

export default Team;
