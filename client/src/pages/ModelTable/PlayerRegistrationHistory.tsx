import { ModelTableContainer } from "../../components/table";
import { usePlayerRegistrationHistory } from "../../context/models/player-registration-history";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ColumnType } from "../../types/table";

const PlayerRegistrationHistory = () => {
  const playerRegistrationHistoryContext = usePlayerRegistrationHistory();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"選手登録情報履歴"}
        headers={[
          {
            label: "大会",
            field: "competition",
            type: ColumnType.FIELD,
            id: "competition",
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
            label: "日付",
            field: "date",
            type: ColumnType.FIELD,
            id: "date",
            defaultDisplay: true,
          },
          {
            label: "チーム",
            field: "team",
            type: ColumnType.FIELD,
            id: "team",
            defaultDisplay: true,
          },
          {
            label: "選手",
            field: "player",
            type: ColumnType.FIELD,
            id: "player",
            defaultDisplay: true,
          },
          {
            label: "ポジション",
            id: "changes.position_group",
            defaultDisplay: true,
            getData: (data) => {
              let base: string = "";
              if (data.registration_type === "変更") {
                base = "変更後→→→";
              }
              return data.changes?.position_group
                ? `${base}${data.changes.position_group}`
                : "";
            },
            type: ColumnType.CUSTOM,
          },
          {
            label: "登録・抹消",
            field: "registration_type",
            type: ColumnType.FIELD,
            id: "registration_type",
            defaultDisplay: true,
          },
        ]}
        contextState={playerRegistrationHistoryContext}
        modelType={ModelType.PLAYER_REGISTRATION_HISTORY}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
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

export default PlayerRegistrationHistory;
