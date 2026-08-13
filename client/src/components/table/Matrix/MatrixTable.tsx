import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Label } from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { APP_ROUTES } from "../../../lib/appRoutes";
import { DisplayPosition, GroupedPlayers } from "./type";
import { getAgeLabel } from "./utils";

type MatrixTableProps<T extends Label> = {
  groupedPlayers: GroupedPlayers[];
  columns: T[];
  positionOptions: DisplayPosition[];

  renderHeader: (column: T) => React.ReactNode;

  renderCell: (
    player: PlayerStatistic,
    column: T,
    index: number,
  ) => React.ReactNode;

  startBaseDate?: Date;
  endBaseDate?: Date;
};

export const MatrixTable = <T extends Label>({
  groupedPlayers,
  columns,
  positionOptions,
  renderHeader,
  renderCell,
  startBaseDate,
  endBaseDate,
}: MatrixTableProps<T>) => {
  const [openPositions, setOpenPositions] = useState<Set<string>>(
    new Set([...positionOptions.map((p) => p.key), "no-pos"]),
  );

  useEffect(() => {
    setOpenPositions(new Set([...positionOptions.map((p) => p.key), "no-pos"]));
  }, [positionOptions]);

  const onTogglePosition = (key: string) => {
    setOpenPositions((prev) => {
      const next = new Set(prev);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  };

  return (
    <div className="max-h-[80vh] max-w-full overflow-auto rounded-md border border-gray-300">
      <table className="border-collapse">
        <thead>
          <tr>
            <th
              className="
                sticky top-0 left-0 z-40
                min-w-[180px] whitespace-nowrap
                border border-gray-300
                bg-white
                px-3 py-1
              "
            >
              <div>選手</div>
            </th>

            {columns.map((column, i) => (
              <th
                key={column.id || i}
                className="
                  sticky top-0 z-30
                  min-w-[80px]
                  border border-gray-300
                  bg-white
                  p-1
                "
              >
                {renderHeader(column)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {groupedPlayers.map((group) => (
            <React.Fragment key={group.key}>
              <tr>
                <td
                  className="
                    sticky left-0 z-20
                    min-w-[140px]
                    border border-gray-300
                    bg-gray-100
                    px-5 py-1.5
                    font-bold
                    whitespace-nowrap
                    hover:cursor-pointer
                  "
                  onClick={() => onTogglePosition(group.key)}
                >
                  <span className="mr-2">
                    {openPositions.has(group.key) ? "▼" : "▶"}
                  </span>
                  {group.label} ({group.players.length})
                </td>

                {columns.map((column, i) => (
                  <td
                    key={column.id || i}
                    className="border-y border-gray-300 bg-gray-100"
                  />
                ))}
              </tr>

              {openPositions.has(group.key) &&
                group.players.map((player, index) => (
                  <tr key={player.player._id}>
                    <td
                      className={`
                        sticky left-0 z-10
                        min-w-[140px] whitespace-nowrap
                        border border-gray-300
                        px-5 py-0.5
                        font-semibold
                        ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      `}
                    >
                      <Link
                        to={`${APP_ROUTES.PLAYER_SUMMARY}/${player.player._id}`}
                        className="underline hover:text-blue-600"
                      >
                        {player.player.name}
                      </Link>

                      <span className="ml-1 text-sm text-gray-500">
                        {player.player.dob &&
                          getAgeLabel(
                            new Date(player.player.dob),
                            startBaseDate,
                            endBaseDate,
                          )}
                      </span>
                    </td>

                    {columns.map((column, i) => (
                      <td
                        key={column.id || i}
                        className={`
                          border border-gray-300
                          ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        `}
                      >
                        {renderCell(player, column, index)}
                      </td>
                    ))}
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
