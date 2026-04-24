import { ModelTableContainer } from "../../components/table";
import { useMatch } from "../../context/models/match";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const Match = () => {
  const context = useMatch();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"試合情報"}
        contextState={context}
        modelType={ModelType.MATCH}
        linkField={[
          {
            field: "competition",
            to: APP_ROUTES.COMPETITION_SUMMARY,
          },
          {
            field: "home_team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
          {
            field: "away_team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
          {
            field: "result-string",
            to: APP_ROUTES.MATCH_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default Match;
