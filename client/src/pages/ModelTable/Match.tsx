import { ModelTableContainer } from "../../components/table";
import { useMatch } from "../../context/models/match";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { MatchGet } from "../../types/models/match";
import { ColumnType } from "../../types/table";

const Match = () => {
  const context = useMatch();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"試合情報"}
        headers={[
          {
            label: "日付",
            field: "date",
            type: ColumnType.FIELD,
            id: "date",
            defaultDisplay: true,
          },
          {
            label: "シーズン",
            field: "season",
            type: ColumnType.FIELD,
            id: "season",
            defaultDisplay: true,
          },
          {
            label: "大会",
            field: "competition",
            type: ColumnType.FIELD,
            id: "competition",
            defaultDisplay: true,
          },
          {
            label: "ステージ",
            field: "competition_stage",
            width: "100px",
            type: ColumnType.FIELD,
            id: "competition_stage",
            defaultDisplay: true,
          },
          {
            label: "節",
            field: "match_week",
            width: "80px",
            type: ColumnType.FIELD,
            id: "match_week",
            defaultDisplay: true,
          },
          {
            label: "ホーム",
            field: "home_team",
            type: ColumnType.FIELD,
            id: "home_team",
            defaultDisplay: true,
          },
          {
            label: "結果",
            id: "result",
            defaultDisplay: true,
            getData: (d: MatchGet) => {
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
            type: ColumnType.CUSTOM,
          },
          {
            label: "アウェイ",
            field: "away_team",
            type: ColumnType.FIELD,
            id: "away_team",
            defaultDisplay: true,
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
          {
            field: "result",
            to: APP_ROUTES.MATCH_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default Match;
