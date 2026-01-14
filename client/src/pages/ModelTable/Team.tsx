import { ModelTableContainer } from "../../components/table";
import { useTeam } from "../../context/models/team";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const Team = () => {
  const teamContext = useTeam();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"チーム情報"}
        headers={[
          { label: "チーム名", field: "team" },
          { label: "略称", field: "abbr" },
          { label: "ジャンル", field: "genre", width: "100px" },
        ]}
        contextState={teamContext}
        modelType={ModelType.TEAM}
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

export default Team;
