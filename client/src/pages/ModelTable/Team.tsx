import { useEffect } from "react";
import { TableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { useTeam } from "../../context/models/team-context";
import { ModelType } from "../../types/models";

const Team = () => {
  const teamContext = useTeam();
  const { isOpen } = useForm();

  useEffect(() => {
    teamContext.readItems();
  }, [isOpen]);

  return (
    <div className="p-6">
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
    </div>
  );
};

export default Team;
