import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../../lib/appRoutes";
import { TeamGet } from "../../../types/models/team";
import HomeCard from "./HomeCard";

type TeamTipsProps = {
  competitionId: string;
  title: string;
  items: TeamGet[];
  className?: string;
};

const TeamTips = ({ competitionId, title, items }: TeamTipsProps) => {
  return (
    <HomeCard
      to={`${APP_ROUTES.COMPETITION_SUMMARY}/${competitionId}`}
      title={title}
    >
      {/* チーム一覧 */}
      <div className="p-3">
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {items.map((team) => (
              <Link
                key={team._id}
                to={`${APP_ROUTES.TEAM_SUMMARY}/${team._id}`}
                className="flex min-h-11 min-w-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:border-green-500 hover:bg-green-50 hover:text-green-800"
                title={team.team || team.enTeam || team.abbr}
              >
                <span className="truncate">
                  {team.abbr || team.team || team.enTeam}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-gray-400">
            チーム情報がありません。
          </p>
        )}
      </div>
    </HomeCard>
  );
};

export default TeamTips;
