import { ModelTableContainer } from "../../components/table";
import { useTeamMatchFormation } from "../../context/models/team-match-formation";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const TeamMatchFormation = () => {
  const teamMatchFormation = useTeamMatchFormation();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"各試合のチームフォーメーション"}
        headers={[
          { label: "試合", field: "match" },
          { label: "チーム", field: "team" },
          { label: "フォーメーション", field: "formation" },
        ]}
        contextState={teamMatchFormation}
        modelType={ModelType.TEAM_MATCH_FORMATION}
        linkField={[
          {
            field: "match",
            to: APP_ROUTES.MATCH_SUMMARY,
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

export default TeamMatchFormation;
