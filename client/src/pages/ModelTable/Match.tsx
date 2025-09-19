import { useEffect } from "react";
import { TableContainer } from "../../components/table";
import { useMatch } from "../../context/models/match-context";
import { ModelType } from "../../types/models";
import { useForm } from "../../context/form-context";
import { useFilter } from "../../context/filter-context";
import { APP_ROUTES } from "../../lib/appRoutes";
import { MatchGet } from "../../types/models/match";
import { toDateKey } from "../../utils";

const Match = () => {
  const context = useMatch();
  const { isOpen } = useForm();
  const { resetFilterConditions } = useFilter();

  useEffect(() => resetFilterConditions(), []);

  useEffect(() => {
    context.metacrud.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <TableContainer
        title={"試合情報"}
        headers={[
          { label: "大会", field: "competition" },
          { label: "ステージ", field: "competition_stage" },
          { label: "シーズン", field: "season" },
          {
            label: "開催日",
            field: (d: MatchGet) => (d.date ? toDateKey(new Date(d.date)) : ""),
          },
          { label: "ホーム", field: "home_team" },
          { label: "アウェイ", field: "away_team" },
          {
            label: "結果",
            field: (d: MatchGet) => {
              // ゴール数がある場合
              const score =
                d.home_goal !== undefined && d.away_goal !== undefined
                  ? `${d.home_goal}-${d.away_goal}`
                  : "";

              // PKがある場合
              const pk =
                d.home_pk_goal !== undefined && d.away_pk_goal !== undefined
                  ? `(${d.home_pk_goal}PK${d.away_pk_goal})`
                  : "";

              return score + pk;
            },
          },
        ]}
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
        ]}
      />
    </div>
  );
};

export default Match;
