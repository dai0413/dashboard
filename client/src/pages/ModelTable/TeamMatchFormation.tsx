import { ModelTableContainer } from "../../components/table";
import { useTeamMatchFormation } from "../../context/models/team-match-formation";
import { ModelType } from "../../types/models";

const TeamMatchFormation = () => {
  const teamMatchFormation = useTeamMatchFormation();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"各試合のチームフォーメーション"}
        contextState={teamMatchFormation}
        modelType={ModelType.TEAM_MATCH_FORMATION}
      />
    </div>
  );
};

export default TeamMatchFormation;
