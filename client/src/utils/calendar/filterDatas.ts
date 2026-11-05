import { NationalMatchSeriesGet } from "../../types/models/national-match-series";

export const filterDatas = (
  data: NationalMatchSeriesGet[],
  startDate: Date,
  endDate: Date,
) => {
  return data.filter((d) => {
    if (!d.joined_at) return false;

    const joinedAt = d.joined_at;
    const leftAt = d.left_at;

    return joinedAt <= endDate && (!leftAt || leftAt >= startDate);
  });
};
