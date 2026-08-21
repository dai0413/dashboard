import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { DisplayPosition, GroupedPlayers } from "../type";
import { sortDob } from "./sortDob";
import { positionBase } from "../../../formation/positionBase";

const fieldPositionBase = Object.fromEntries(
  Object.entries(positionBase).filter(([position]) => position !== "GK"),
);

const getNearestPosition = (
  positions: string[],
  targetPositions: string[],
): string | undefined => {
  const candidates = positions.filter(
    (position) => fieldPositionBase[position as keyof typeof fieldPositionBase],
  );

  const targets = targetPositions
    .filter(
      (position) =>
        fieldPositionBase[position as keyof typeof fieldPositionBase],
    )
    .reverse();

  if (candidates.length === 0 || targets.length === 0) {
    return undefined;
  }

  let nearestPosition: string | undefined;
  let minDistance = Infinity;

  for (const candidate of candidates) {
    const candidateBase =
      fieldPositionBase[candidate as keyof typeof fieldPositionBase];

    for (const target of targets) {
      const targetBase =
        fieldPositionBase[target as keyof typeof fieldPositionBase];

      const distance =
        (candidateBase.x - targetBase.x) ** 2 +
        (candidateBase.y - targetBase.y) ** 2;

      if (distance < minDistance) {
        minDistance = distance;
        nearestPosition = target;
      }
    }
  }

  return nearestPosition;
};

const getGroupedPosition = (
  player: PlayerStatistic,
  allPositions: string[],
): string | undefined => {
  // 1. mainPosition が groupedPositions に存在するなら優先
  if (player.mainPosition && allPositions.includes(player.mainPosition)) {
    return player.mainPosition;
  }

  // 2. groupedPositions に存在する position があれば、
  //    positionCounts の多い順に採用
  const candidates = Object.entries(player.positionCounts)
    .filter(([position]) => allPositions.includes(position))
    .sort(([, countA], [, countB]) => (countB ?? 0) - (countA ?? 0));

  if (candidates[0]) {
    return candidates[0][0];
  }

  // 3. groupedPositions に直接該当しない場合は、
  //    positionBase 上で最も近い grouped position に寄せる
  const playerPositions = [
    player.mainPosition,
    ...Object.keys(player.positionCounts),
  ].filter((p) => typeof p === "string");

  return getNearestPosition(playerPositions, allPositions);
};

export const createGroupedPlayers = (
  playerStatistics: PlayerStatistic[],
  groupedPositions: DisplayPosition[],
): GroupedPlayers[] => {
  const uniquePlayerStatistics = Array.from(
    new Map(playerStatistics.map((v) => [v.player._id, v])).values(),
  );

  const allPositions = groupedPositions.flatMap((group) => group.positions);

  const playerPositionMap = new Map(
    uniquePlayerStatistics.map((player) => [
      player.player._id,
      getGroupedPosition(player, allPositions),
    ]),
  );

  const hasPositionPlayers = groupedPositions.map((group) => ({
    ...group,
    players: uniquePlayerStatistics
      .filter((player) =>
        group.positions.includes(
          playerPositionMap.get(player.player._id) ?? "",
        ),
      )
      .sort(sortDob),
  }));

  const noPositionPlayers: GroupedPlayers[] = [
    {
      key: "no-pos",
      label: "データなし",
      players: uniquePlayerStatistics
        .filter((player) => !playerPositionMap.get(player.player._id))
        .sort(sortDob),
      positions: [],
    },
  ];

  return [...hasPositionPlayers, ...noPositionPlayers].filter(
    (group) => group.players.length > 0,
  );
};
