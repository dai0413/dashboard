import { useTeamCompetitionSeason } from "../../context/models/team-competition-season-context";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";

const TeamCompetitionSeason = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.TEAM_COMPETITION_SEASON}
      modelType={ModelType.TEAM_COMPETITION_SEASON}
      modelContext={useTeamCompetitionSeason()}
      title="チームの大会参加記録詳細"
    />
  );
};

export default TeamCompetitionSeason;
