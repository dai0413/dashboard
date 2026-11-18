import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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

  // tbodyの先頭に表示する要素
  renderBeforeBody?: (column: T, index: number) => string;

  renderCell: (
    positionKey: string,
    player: MatrixPlayer,
    column: T,
    index: number,
  ) => React.ReactNode;

  startBaseDate?: Date;
  endBaseDate?: Date;
};

function useElementHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => setHeight(el.getBoundingClientRect().height);
    update(); // 初回描画前に測る(ちらつき防止)

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, height] as const;
}

export const MatrixTable = <T extends Label>({
  defaultOpenPositions,
  groupedPlayers,
  topHeaderText,
  columns,
  renderHeader,
  renderBeforeBody,
  renderCell,
}: MatrixTableProps<T>) => {
  const [openPositions, setOpenPositions] = useState<Set<string>>(
    new Set(defaultOpenPositions),
  );

  useEffect(() => {
    if (defaultOpenPositions)
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

  const [headRowRef, headRowHeight] = useElementHeight<HTMLTableRowElement>();
  const cell = "border-b border-r border-gray-300";
  const headCell = `${cell} bg-white`;
  const bodyCell = (index: number) =>
    `${cell} ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`;

  return (
    <>
      <div className="max-h-[80vh] max-w-full overflow-auto rounded-md border-t border-l border-gray-300">
        <table className="border-separate border-spacing-0">
          <thead>
            <tr ref={headRowRef}>
              <th
                className={`sticky top-0 left-0 z-40 min-w-[180px] whitespace-nowrap px-3 py-1 ${headCell}`}
              >
                <div>選手</div>
                {topHeaderText && (
                  <span className="ml-1 text-sm text-gray-500">
                    {topHeaderText}
                  </span>
                )}
              </th>
              <th className={`sticky top-0 z-30 min-w-[80px] p-1 ${headCell}`}>
                スタメン/途中
              </th>
              <th className={`sticky top-0 z-30 min-w-[80px] p-1 ${headCell}`}>
                時間
              </th>
              {columns.map((column, i) => (
                <th
                  key={column.id || i}
                  className={`sticky top-0 z-30 min-w-[80px] p-1 ${headCell}`}
                >
                  {renderHeader(column)}
                </th>
              ))}
            </tr>

            {renderBeforeBody && (
              <tr>
                <th
                  style={{ top: headRowHeight }}
                  className={`sticky left-0 z-40 min-w-[180px] ${headCell}`}
                />
                <th
                  style={{ top: headRowHeight }}
                  className={`sticky z-30 ${headCell}`}
                />
                <th
                  style={{ top: headRowHeight }}
                  className={`sticky z-30 ${headCell}`}
                />
                {columns.map((column, i) => (
                  <th
                    key={column.id || i}
                    style={{ top: headRowHeight }}
                    className={`sticky z-30 px-1 py-1 text-center text-sm font-normal leading-tight whitespace-pre-line tabular-nums text-gray-500 ${headCell}`}
                  >
                    {renderBeforeBody(column, i)}
                  </th>
                ))}
              </tr>
            )}
          </thead>

          <tbody>
            {groupedPlayers &&
              groupedPlayers.map((group) => (
                <React.Fragment key={group.key}>
                  <tr>
                    <td
                      className={`${cell} sticky left-0 z-20 min-w-[180px] bg-gray-100 px-5 py-1.5 font-bold whitespace-nowrap hover:cursor-pointer`}
                      onClick={() => onTogglePosition(group.key)}
                    >
                      <span className="mr-2">
                        {openPositions.has(group.key) ? "▼" : "▶"}
                      </span>
                      {group.position} ({group.players.length})
                    </td>

                    <td className={`${cell} bg-gray-100`} />
                    <td className={`${cell} bg-gray-100`} />
                    {columns.map((column, i) => (
                      <td
                        key={column.id || i}
                        className={`${cell} bg-gray-100`}
                      />
                    ))}
                  </tr>

                  {openPositions.has(group.key) &&
                    group.players.map((player, index) => (
                      <tr key={player.player._id}>
                        <td
                          className={`${bodyCell(index)} sticky left-0 z-10 min-w-[180px] whitespace-nowrap px-5 py-0.5 font-semibold`}
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
                          className={`${bodyCell(index)} whitespace-nowrap px-5 py-0.5 font-semibold`}
                        >
                          {`${player.starts}`}
                          <span className="text-sm text-gray-500">/</span>
                          {`${player.subs}`}
                        </td>

                        <td
                          className={`${bodyCell(index)} whitespace-nowrap px-5 py-0.5 font-semibold`}
                        >
                          {`${player.minutes}`}

                          <span className="text-sm text-gray-500">分</span>
                        </td>

                        {columns.map((column, i) => {
                          return (
                            <td
                              key={column.id || i}
                              className={bodyCell(index)}
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
