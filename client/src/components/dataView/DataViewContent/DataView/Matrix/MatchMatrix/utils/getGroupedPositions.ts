import { displayPositions } from "../../context/displayPositions";

export const getGroupedPositions = (positions: string[]) => {
  const result = positions.map((position) => {
    const displayPosition = displayPositions.find((item) =>
      item.positions.includes(position),
    );

    if (!displayPosition) {
      return {
        key: position,
        label: position,
        color: undefined,
        positions: [position],
      };
    }

    return {
      key: position,
      label: position,
      color: displayPosition.color,
      positions: [position],
    };
  });

  return result;
};
