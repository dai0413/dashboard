import { useEffect } from "react";
import { ModelTableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { usePlayerRegistrationHistory } from "../../context/models/player-registration-history";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { useFilter } from "../../context/filter-context";

const PlayerRegistrationHistory = () => {
  const playerRegistrationHistoryContext = usePlayerRegistrationHistory();
  const { isOpen } = useForm();
  const { resetFilterConditions } = useFilter();

  useEffect(() => resetFilterConditions(), []);
  useEffect(() => {
    playerRegistrationHistoryContext.metacrud.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"選手登録情報履歴"}
        headers={[
          { label: "日付", field: "date" },
          { label: "選手", field: "player" },
          {
            label: "ポジション",
            field: "changes.position_group",
            getData: (data) => {
              let base: string = "";
              if (data.registration_type === "変更") {
                base = "変更後→→→";
              }
              return data.changes.position_group
                ? `${base}${data.changes.position_group}`
                : "";
            },
          },
          { label: "大会", field: "competition" },
          { label: "シーズン", field: "season" },
          { label: "登録・抹消", field: "registration_type" },
          { label: "状況", field: "registration_status" },
        ]}
        contextState={playerRegistrationHistoryContext}
        modelType={ModelType.PLAYER_REGISTRATION_HISTORY}
        linkField={[
          {
            field: "name",
            to: APP_ROUTES.PLAYER,
          },
        ]}
      />
    </div>
  );
};

export default PlayerRegistrationHistory;
