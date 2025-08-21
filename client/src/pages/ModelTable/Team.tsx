import { useEffect } from "react";
import { TableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { useTeam } from "../../context/models/team-context";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { useFilter } from "../../context/filter-context";

const Team = () => {
  const teamContext = useTeam();
  const { isOpen } = useForm();
  const { resetFilterConditions } = useFilter();

  useEffect(() => resetFilterConditions(), []);
  useEffect(() => {
    teamContext.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <TableContainer
        title={"チーム情報"}
        headers={[
          { label: "チーム名", field: "team" },
          { label: "略称", field: "abbr" },
          { label: "ジャンル", field: "genre", width: "100px" },
        ]}
        contextState={teamContext}
        modelType={ModelType.TEAM}
        summaryLinkField={{
          field: "team",
          to: APP_ROUTES.TEAM_SUMMARY,
        }}
      />
    </div>
  );
};

export default Team;
