import { positionBase } from "./positionBase";
import { PositionListItem } from "../../types/formation";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../lib/appRoutes";

export const PositionPlayerList = ({ position, players }: PositionListItem) => {
  const point = positionBase[position as keyof typeof positionBase];

  if (!point) return;

  const sorted = players.sort((a, b) => {
    if (!a.positionCounts[position] && !b.positionCounts[position]) return 0;
    if (!a.positionCounts[position]) return 1;
    if (!b.positionCounts[position]) return -1;

    return b.positionCounts[position] - a.positionCounts[position];
  });

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${point.x}%`,
        top: `${point.y}%`,
      }}
    >
      <div className="overflow-hidden rounded-md bg-black/60 text-sm text-white shadow-lg">
        <div className="border-b border-white/20 px-3 py-1 text-center font-bold">
          {position}
        </div>

        <div
          className={
            sorted.length >= 4 ? "max-h-[96px] overflow-y-auto" : undefined
          }
        >
          {sorted.map(({ player, positionCounts }) => (
            <div key={player._id} className="flex items-center gap-4 px-3 py-1">
              <div className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap">
                {player._id ? (
                  <Link
                    to={`${APP_ROUTES.PLAYER_SUMMARY}/${player._id}`}
                    className="underline hover:text-blue-600"
                  >
                    {player.name}
                  </Link>
                ) : (
                  <span>{player.name}</span>
                )}
              </div>

              <span className="shrink-0">{positionCounts[position] ?? 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
