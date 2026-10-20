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

const POSITION_GROUPS = [
  { primary: ["RWG", "LWG", "WG"], related: ["RSH", "LSH", "SH"] },
  { primary: ["RSH", "LSH", "SH"], related: ["RWG", "LWG", "WG"] },
  { primary: ["RSB", "LSB", "SB"], related: ["RWB", "LWB", "WB"] },
  { primary: ["RWB", "LWB", "WB"], related: ["RSB", "LSB", "SB"] },
];

const getGroupedPositions = (
  player: PlayerStatistic,
  allPositions: string[],
  multiPosition = false,
): string[] => {
  const uniquePositions = [
    ...new Set(
      [...Object.keys(player.positionCounts), player.mainPosition].filter(
        (p): p is string => typeof p === "string",
      ),
    ),
  ];

  // 1. 関連ポジションを相互に補完
  for (const { primary, related } of POSITION_GROUPS) {
    const hasPrimary = primary.some((p) => allPositions.includes(p));
    const hasRelated = related.some((p) => allPositions.includes(p));

    if (hasPrimary && !hasRelated) {
      const hasRelatedPosition = uniquePositions.some((p) =>
        related.includes(p),
      );

      if (hasRelatedPosition) {
        const target = primary.find((p) => allPositions.includes(p));

        if (target) return [target];
      }
    }
  }

  // 2. allPositions に直接一致するポジション
  if (multiPosition) {
    const matched = uniquePositions.filter((p) => allPositions.includes(p));

    if (matched.length > 0) return matched;
  } else {
    const matched = Object.entries(player.positionCounts)
      .filter(([p]) => allPositions.includes(p))
      .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0));

    if (matched[0]) return [matched[0][0]];

    if (player.mainPosition && allPositions.includes(player.mainPosition)) {
      return [player.mainPosition];
    }
  }

  // 3. R/L付きポジションを、R/Lなしのポジションに寄せる
  for (const position of uniquePositions) {
    const basePosition = position.replace(/^[RL]/, "");

    if (allPositions.includes(basePosition)) {
      return [basePosition];
    }
  }

  // 4. R/Lを付けて一致するポジションを探す
  for (const position of uniquePositions) {
    if (allPositions.includes(`R${position}`)) {
      return [`R${position}`];
    }

    if (allPositions.includes(`L${position}`)) {
      return [`L${position}`];
    }
  }

  // 5. 最も近いポジションを取得
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
      getGroupedPositions(player, allPositions, multiPosition),
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

  const groupedPlayers = [...hasPositionPlayers, ...noPositionPlayers].filter(
    (group) => group.players,
  );

  return groupedPlayers;
};
