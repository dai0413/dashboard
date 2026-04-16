import { ModelTableContainer } from "../../components/table";
import { usePlayerRegistration } from "../../context/models/player-registration";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ColumnType } from "../../types/table";

const PlayerRegistration = () => {
  const playerRegistrationContext = usePlayerRegistration();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"選手登録情報"}
        headers={[
          {
            label: "大会",
            field: "competition",
            type: ColumnType.FIELD,
            id: "competition",
          },
          {
            label: "シーズン",
            field: "season",
            type: ColumnType.FIELD,
            id: "season",
          },
          { label: "日付", field: "date", type: ColumnType.FIELD, id: "date" },
          {
            label: "チーム",
            field: "team",
            type: ColumnType.FIELD,
            id: "team",
          },
          {
            label: "選手",
            field: "player",
            type: ColumnType.FIELD,
            id: "player",
          },
          {
            label: "登録・抹消",
            field: "registration_type",
            type: ColumnType.FIELD,
            id: "registration_type",
          },
          {
            label: "状況",
            field: "registration_status",
            type: ColumnType.FIELD,
            id: "registration_status",
          },
        ]}
        contextState={playerRegistrationContext}
        modelType={ModelType.PLAYER_REGISTRATION}
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

export default PlayerRegistration;
