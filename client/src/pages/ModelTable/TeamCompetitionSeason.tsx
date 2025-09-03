import { useEffect } from "react";
import { TableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { useTeamCompetitionSeason } from "../../context/models/team-competition-season-context";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const TeamCompetitionSeason = () => {
  const teamCompetitionSeason = useTeamCompetitionSeason();
  const { isOpen } = useForm();

  useEffect(() => {
    teamCompetitionSeason.metacrud.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <TableContainer
        title={"チームの大会参加記録"}
        headers={[
          { label: "チーム", field: "team" },
          { label: "シーズン", field: "season", width: "120px" },
          { label: "大会名", field: "competition" },
        ]}
        contextState={teamCompetitionSeason}
        modelType={ModelType.TEAM_COMPETITION_SEASON}
        // linkField={[
        //   {
        //     field: "name",
        //     to: APP_ROUTES.NATIONAL_SUMMARY,
        //   },
        // ]}
      />
    </div>
  );
};

export default TeamCompetitionSeason;
