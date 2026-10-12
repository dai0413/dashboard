import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { DisplayPosition, GroupedPlayers, MatrixPlayer } from "../type";
import { sortDob } from "./sortDob";
import { positionBase } from "../../../../../formation/positionBase";

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

  const playerPositions = [
    player.mainPosition,
    ...Object.keys(player.positionCounts),
  ].filter((p) => typeof p === "string");

  // 3. R/L付きのポジションを、R/Lなしのポジションに寄せる
  for (const position of playerPositions) {
    const basePosition = position.replace(/^[RL]/, "");

    if (allPositions.includes(basePosition)) {
      return basePosition;
    }
  }

  // 4. R/L を付けて一致する position を探す
  for (const position of playerPositions) {
    if (allPositions.includes(`${"R"}${position}`)) {
      return `${"R"}${position}`;
    }

    if (allPositions.includes(`${"L"}${position}`)) {
      return `${"L"}${position}`;
    }
  }

  // 5. それでも該当しなければ、位置的に最も近い grouped position
  return getNearestPosition(playerPositions, allPositions);
};

const getGroupedPositions = (
  player: PlayerStatistic,
  allPositions: string[],
): string[] => {
  const playerPositions = [
    player.mainPosition,
    ...Object.keys(player.positionCounts),
  ].filter((p): p is string => typeof p === "string");

  // 重複を除去
  const uniquePositions = [...new Set(playerPositions)];

  // 1. groupedPositions に直接一致するポジションをすべて取得
  const matchedPositions = uniquePositions.filter((position) =>
    allPositions.includes(position),
  );

  if (matchedPositions.length > 0) {
    return matchedPositions;
  }

  // 2. R/Lなしのポジションに寄せる
  for (const position of uniquePositions) {
    const basePosition = position.replace(/^[RL]/, "");

    if (allPositions.includes(basePosition)) {
      return [basePosition];
    }
  }

  // 3. R/Lを付けたポジションを探す
  for (const position of uniquePositions) {
    if (allPositions.includes(`R${position}`)) {
      return [`R${position}`];
    }

    if (allPositions.includes(`L${position}`)) {
      return [`L${position}`];
    }
  }

  // 4. 最も近いポジションを1つだけ返す
  const nearestPosition = getNearestPosition(uniquePositions, allPositions);

  return nearestPosition ? [nearestPosition] : [];
};

type CreateGroupedPlayersParams = {
  playerStatistics: MatrixPlayer[];
  groupedPositions: DisplayPosition[];
  multiPosition?: boolean;
};

export const createGroupedPlayers = ({
  playerStatistics,
  groupedPositions,
  multiPosition = false,
}: CreateGroupedPlayersParams): GroupedPlayers[] => {
  const uniquePlayerStatistics = Array.from(
    new Map(playerStatistics.map((v) => [v.player._id, v])).values(),
  );

  const allPositions = groupedPositions.flatMap((group) => group.positions);

  const playerPositionMap = new Map(
    uniquePlayerStatistics.map((player) => [
      player.player._id,
      multiPosition
        ? getGroupedPositions(player, allPositions)
        : [getGroupedPosition(player, allPositions)].filter(
            (position): position is string => !!position,
          ),
    ]),
  );

  const hasPositionPlayers = groupedPositions.map((group) => ({
    ...group,
    players: uniquePlayerStatistics
      .filter((player) =>
        group.positions.some((position) =>
          playerPositionMap.get(player.player._id)?.includes(position),
        ),
      )
      .sort(sortDob),
  }));

  const noPositionPlayers: GroupedPlayers[] = [
    {
      key: "no-pos",
      position: "データなし",
      players: uniquePlayerStatistics
        .filter((player) => !playerPositionMap.get(player.player._id)?.length)
        .sort(sortDob),
      positions: [],
    },
  ];

  return [...hasPositionPlayers, ...noPositionPlayers].filter(
    (group) => group.players.length > 0,
  );
};
