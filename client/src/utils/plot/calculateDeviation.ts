import { RadarField, RadarKey } from "../../components/plot/RadarChart/types";

export const deviationValue = (
  value: number,
  average: number,
  stdDev: number,
  higherIsBetter = true,
): number => {
  if (stdDev === 0) {
    return 50;
  }

  const sign = higherIsBetter ? 1 : -1;

  return 50 + (sign * (10 * (value - average))) / stdDev;
};

export const calculateDeviation = <T extends string>(
  plotAverages: Map<T, Record<RadarKey, number>>,
  baseAverage: Record<RadarKey, number>,
  baseStdDevs: Record<RadarKey, number>,
  fields: RadarField[],
): Map<T, Record<RadarKey, number>> => {
  const result = new Map<T, Record<RadarKey, number>>();

  for (const [group, average] of plotAverages) {
    const deviationData = {} as Record<RadarKey, number>;

    for (const field of fields) {
      deviationData[field.key] = deviationValue(
        average[field.key],
        baseAverage[field.key],
        baseStdDevs[field.key],
        field.higherIsBetter,
      );
    }

    result.set(group, deviationData);
  }

  return result;
};
