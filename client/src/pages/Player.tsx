import { TableContainer } from "../components/table";
import { usePlayer } from "../context/models/player-context";
import { ModelType } from "../types/models";

const Player = () => {
  const playerContext = usePlayer();

  return (
    <TableContainer
      title={"選手情報"}
      headers={[
        { label: "名前", field: "name" },
        { label: "英名", field: "en_name" },
        { label: "生年月日", field: "dob" },
        { label: "出身地", field: "pob" },
      ]}
      contextState={playerContext}
      modelType={ModelType.PLAYER}
    />
  );
};

export default Player;
