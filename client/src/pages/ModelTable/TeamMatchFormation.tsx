import { ModelTableContainer } from "../../components/table";
import { useTeamMatchFormation } from "../../context/models/team-match-formation";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const TeamMatchFormation = () => {
  const teamMatchFormation = useTeamMatchFormation();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"チームの大会参加記録"}
        headers={[
          { label: "試合", field: "match" },
          { label: "シーズン", field: "team" },
          { label: "フォーメーション", field: "formation" },
        ]}
        contextState={teamMatchFormation}
        modelType={ModelType.TEAM_MATCH_FORMATION}
        linkField={[
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default TeamMatchFormation;
