import { ModelTableContainer } from "../../components/table";
import { usePlayer } from "../../context/models/player";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ColumnType } from "../../types/table";

const Player = () => {
  const playerContext = usePlayer();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"選手情報"}
        headers={[
          {
            label: "名前",
            field: "name",
            type: ColumnType.FIELD,
            id: "name",
            defaultDisplay: true,
          },
          {
            label: "英名",
            field: "en_name",
            type: ColumnType.FIELD,
            id: "en_name",
            defaultDisplay: true,
          },
          {
            label: "生年月日",
            field: "dob",
            type: ColumnType.FIELD,
            id: "dob",
            defaultDisplay: true,
          },
          {
            label: "出身地",
            field: "pob",
            type: ColumnType.FIELD,
            id: "pob",
            defaultDisplay: true,
          },
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
