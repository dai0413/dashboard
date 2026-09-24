import {
  RadarData,
  RadarDataset,
  RadarField,
} from "../../components/plot/RadarChart/types";
import { RadarValues } from "../plot/buildRadarPlotData";

const guideLine = (
  value: number,
  dataCount: number,
  options?: {
    dash?: number[];
    color?: string;
    width?: number;
  },
): RadarDataset => ({
  label: `${value}`,
  data: Array(dataCount).fill(value),
  borderColor: options?.color ?? "#9ca3af",
  backgroundColor: "transparent",
  borderWidth: options?.width ?? 1,
  borderDash: options?.dash ?? [4, 4],
  pointRadius: 0,
  pointHoverRadius: 0,
  pointHitRadius: 0,
  guide: true,
});

export const convertToRadarData = <T>(
  datas: T,
  fields: RadarField[],
  label?: string,
): RadarData | null => {
  const radarValues = datas as RadarValues;

  if (!radarValues) return null;

  const labels = fields.map((f) => f.label);
  const fieldCountr = fields.length;

  const datasetsFields = fields.filter((f) => !!radarValues[f.key]);

  const datasets = [
    {
      label: label,
      data: datasetsFields.map((f) => radarValues[f.key].deviation),
      tooltipData: datasetsFields.map((f) => radarValues[f.key]),
      borderColor: "#2563eb",
      backgroundColor: "rgba(37,99,235,0.2)",
    },
    guideLine(40, fieldCountr),
    guideLine(50, fieldCountr, {
      dash: [],
      width: 2,
      color: "#6b7280",
    }),
    guideLine(60, fieldCountr),
  ];

  return { labels, datasets };
};
