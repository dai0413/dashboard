import { useEffect } from "react";
import { ModelTableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { usePlayer } from "../../context/models/player";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { useFilter } from "../../context/filter-context";

const Player = () => {
  const playerContext = usePlayer();
  const { isOpen } = useForm();
  const { resetFilterConditions } = useFilter();

  useEffect(() => resetFilterConditions(), []);
  useEffect(() => {
    playerContext.metacrud.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"選手情報"}
        headers={[
          { label: "名前", field: "name" },
          { label: "英名", field: "en_name" },
          { label: "生年月日", field: "dob" },
          { label: "出身地", field: "pob" },
        ]}
        contextState={playerContext}
        modelType={ModelType.PLAYER}
        linkField={[
          {
            field: "name",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default Player;
