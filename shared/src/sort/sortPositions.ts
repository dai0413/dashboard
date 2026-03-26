import { position } from "@dai0413/myorg-shared";

const positions = position();
const positionIndexMap: Record<string, number> = Object.fromEntries(
  positions.map((pos, index) => [pos.key, index]),
);

const DEFAULT_INDEX = Number.MAX_SAFE_INTEGER;

export const sortPositions = (
  positions: (string | undefined | null)[],
  { desc = true }: { desc?: boolean } = {},
): string[] => {
  return positions
    .filter((p): p is string => typeof p === "string")
    .sort((a, b) => {
      const diff =
        (positionIndexMap[a] ?? DEFAULT_INDEX) -
        (positionIndexMap[b] ?? DEFAULT_INDEX);
      return desc ? -diff : diff;
    });
};
