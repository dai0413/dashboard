import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { DisplayPosition, GroupedPlayers } from "../type";
import { sortDob } from "./sortDob";

const getGroupedPosition = (
  player: PlayerStatistic,
  allPositions: string[],
): string | undefined => {
  // mainPosition が groupedPositions に存在するなら優先
  if (player.mainPosition && allPositions.includes(player.mainPosition)) {
    return player.mainPosition;
  }

  // groupedPositions に存在する position だけを候補にする
  const candidates = Object.entries(player.positionCounts)
    .filter(([position]) => allPositions.includes(position))
    .sort(([, countA], [, countB]) => (countB ?? 0) - (countA ?? 0));

  return candidates[0]?.[0];
};

export const createGroupedPlayers = (
  playerStatistics: PlayerStatistic[],
  groupedPositions: DisplayPosition[],
): GroupedPlayers[] => {
  // 選手一覧（重複除去）
  const uniquePlayerStatistics = Array.from(
    new Map(playerStatistics.map((v) => [v.player._id, v])).values(),
  );

  const allPositions = groupedPositions.flatMap((group) => group.positions);

  const noPositionStatistics = uniquePlayerStatistics.filter(
    (p) => !getGroupedPosition(p, allPositions),
  );

  const hasPositionPlayers: GroupedPlayers[] = groupedPositions.map(
    (group) => ({
      ...group,
      players: uniquePlayerStatistics
        .filter((p) => {
          const position = getGroupedPosition(p, allPositions);

          return position && group.positions.includes(position);
        })
        .sort((a, b) => sortDob(a, b)),
    }),
  );

  const noPositionPlayers: GroupedPlayers[] = [
    {
      key: "no-pos",
      label: "データなし",
      players: noPositionStatistics.sort((a, b) => sortDob(a, b)),
      positions: [],
    },
  ];

  const groupedPlayers = [...hasPositionPlayers, ...noPositionPlayers].filter(
    (group) => group.players.length > 0,
  );

  return groupedPlayers;
};
