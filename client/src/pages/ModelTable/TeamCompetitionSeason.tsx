import { ModelTableContainer } from "../../components/table";
import { useTeamCompetitionSeason } from "../../context/models/team-competition-season";
import { ModelType } from "../../types/models";

const TeamCompetitionSeason = () => {
  const teamCompetitionSeason = useTeamCompetitionSeason();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"チームの大会参加記録"}
        contextState={teamCompetitionSeason}
        modelType={ModelType.TEAM_COMPETITION_SEASON}
      />
    </div>
  );
};

export default TeamCompetitionSeason;
