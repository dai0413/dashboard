import { TableContainer } from "../../components/table";
import { useTeam } from "../../context/models/team-context";
import { ModelType } from "../../types/models";

const Team = () => {
  const teamContext = useTeam();

  return (
    <TableContainer
      title={"チーム情報"}
      headers={[
        { label: "チーム名", field: "team" },
        { label: "略称", field: "abbr" },
        { label: "ジャンル", field: "genre" },
      ]}
      contextState={teamContext}
      modelType={ModelType.TEAM}
    />
  );
};

export default Team;
