import { useEffect } from "react";
import { ModelTableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { usePlayerRegistration } from "../../context/models/player-registration";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { useFilter } from "../../context/filter-context";

const PlayerRegistration = () => {
  const playerRegistrationContext = usePlayerRegistration();
  const { isOpen } = useForm();
  const { resetFilterConditions } = useFilter();

  useEffect(() => resetFilterConditions(), []);
  useEffect(() => {
    playerRegistrationContext.metacrud.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"選手登録情報"}
        headers={[
          { label: "大会", field: "competition" },
          { label: "シーズン", field: "season" },
          { label: "日付", field: "date" },
          { label: "チーム", field: "team" },
          { label: "選手", field: "player" },
          { label: "登録・抹消", field: "registration_type" },
          { label: "状況", field: "registration_status" },
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
