import { ModelTableContainer } from "../../components/table";
import { useTeamCompetitionSeason } from "../../context/models/team-competition-season";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const TeamCompetitionSeason = () => {
  const teamCompetitionSeason = useTeamCompetitionSeason();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"チームの大会参加記録"}
        headers={[
          { label: "チーム", field: "team" },
          { label: "シーズン", field: "season", width: "120px" },
          { label: "大会名", field: "competition" },
        ]}
        contextState={teamCompetitionSeason}
        modelType={ModelType.TEAM_COMPETITION_SEASON}
        linkField={[
          {
            field: "competition",
            to: APP_ROUTES.COMPETITION_SUMMARY,
          },
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default TeamCompetitionSeason;
