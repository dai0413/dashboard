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
          { label: "大会", field: "competition" },
          { label: "シーズン", field: "season" },
          { label: "登録・抹消", field: "registration_type" },
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
