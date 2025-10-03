import { useTeamCompetitionSeason } from "../../context/models/team-competition-season-context";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const TeamCompetitionSeason = () => {
  return (
    <Detail
      modelType={ModelType.TEAM_COMPETITION_SEASON}
      modelContext={useTeamCompetitionSeason()}
      title="チームの大会参加記録詳細"
    />
  );
};

export default TeamCompetitionSeason;
