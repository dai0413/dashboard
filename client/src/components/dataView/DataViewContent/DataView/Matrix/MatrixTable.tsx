import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Label } from "@dai0413/myorg-shared";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { GroupedPlayers, MatrixPlayer } from "./type";

type MatrixTableProps<T extends Label> = {
  defaultOpenPositions: Set<string>;
  groupedPlayers: GroupedPlayers[];

  columns: T[];

  topHeaderText?: string;

  renderHeader: (column: T) => React.ReactNode;

  renderCell: (
    positionKey: string,
    player: MatrixPlayer,
    column: T,
    index: number,
  ) => React.ReactNode;

  startBaseDate?: Date;
  endBaseDate?: Date;
};

export const MatrixTable = <T extends Label>({
  defaultOpenPositions,
  groupedPlayers,
  topHeaderText,
  columns,
  renderHeader,
  renderCell,
}: MatrixTableProps<T>) => {
  const [openPositions, setOpenPositions] = useState<Set<string>>(
    new Set(defaultOpenPositions),
  );

  useEffect(() => {
    setOpenPositions(new Set([...defaultOpenPositions, "no-pos"]));
  }, [defaultOpenPositions]);

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
    <>
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

                {topHeaderText && (
                  <span className="ml-1 text-sm text-gray-500">
                    {topHeaderText}
                  </span>
                )}
              </th>

              <th
                className="
                  sticky top-0 z-30
                  min-w-[80px]
                  border border-gray-300
                  bg-white
                  p-1
                "
              >
                スタメン/途中
              </th>

              <th
                className="
                  sticky top-0 z-30
                  min-w-[80px]
                  border border-gray-300
                  bg-white
                  p-1
                "
              >
                時間
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
                    {group.position} ({group.players.length})
                  </td>

                  <td className="border-y border-gray-300 bg-gray-100" />
                  <td className="border-y border-gray-300 bg-gray-100" />
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
                          {player.ageLabel}
                        </span>

                        <span className="ml-1 text-sm text-gray-500">
                          {player.note}
                        </span>
                      </td>

                      <td
                        className={`
                        whitespace-nowrap
                        border border-gray-300
                        px-5 py-0.5
                        font-semibold
                          ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        `}
                      >
                        {`${player.starts}`}
                        <span className="text-sm text-gray-500">/</span>
                        {`${player.subs}`}
                      </td>

                      <td
                        className={`                        
                        whitespace-nowrap
                        border border-gray-300
                        px-5 py-0.5
                        font-semibold
                          ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        `}
                      >
                        {`${player.minutes}`}

                        <span className="text-sm text-gray-500">分</span>
                      </td>

                      {columns.map((column, i) => {
                        return (
                          <td
                            key={column.id || i}
                            className={`
                          border border-gray-300
                          ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        `}
                          >
                            {renderCell(group.key, player, column, index)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
