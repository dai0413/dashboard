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

export const sortByPosition = <T extends object>(
  data: T[],
  field: keyof T,
  { desc = false }: { desc?: boolean } = {},
): T[] => {
  return [...data].sort((a, b) => {
    const aPosition = a[field];
    const bPosition = b[field];

    const aIndex =
      typeof aPosition === "string"
        ? (positionIndexMap[aPosition] ?? DEFAULT_INDEX)
        : DEFAULT_INDEX;

    const bIndex =
      typeof bPosition === "string"
        ? (positionIndexMap[bPosition] ?? DEFAULT_INDEX)
        : DEFAULT_INDEX;

    const diff = aIndex - bIndex;

    return desc ? -diff : diff;
  });
};
