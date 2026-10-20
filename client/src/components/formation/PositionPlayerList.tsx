import { positionBase } from "./positionBase";
import { PositionListItem } from "../../types/formation";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../lib/appRoutes";

export const PositionPlayerList = ({ position, players }: PositionListItem) => {
  const point = positionBase[position as keyof typeof positionBase];

  if (!point) return;

  const sorted = [...players].sort((a, b) => {
    const aCount = a.positionCounts[position] ?? 0;
    const bCount = b.positionCounts[position] ?? 0;

    return bCount - aCount;
  });

  const positionStyle = point.color
    ? {
        backgroundColor: `color-mix(in srgb, ${point.color} 30%, white)`,
      }
    : {};

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${point.x}%`,
        top: `${point.y}%`,
      }}
    >
      <div className="w-[160px] overflow-hidden rounded-md border border-gray-600 bg-white text-sm shadow-lg">
        <div
          className="border-gray-600 px-3 py-1 text-center font-bold"
          style={positionStyle}
        >
          {position}
        </div>

        <div
          className={
            sorted.length >= 4 ? "max-h-[96px] overflow-y-auto" : undefined
          }
        >
          {sorted.map(({ player, positionCounts }) => (
            <div
              key={player._id}
              className="flex items-center gap-2 px-2 py-1 text-sm text-gray-500"
            >
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
