import {
  Chart as ChartJS,
  ChartOptions,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { useMemo } from "react";
import { RadarChartProps, RadarDataset } from "./types";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

export const RadarChart = ({
  labels,
  datasets,
  min = 30,
  max = 70,
  stepSize = 10,
}: RadarChartProps) => {
  const data = useMemo(
    () => ({
      labels,
      datasets,
    }),
    [labels, datasets],
  );

  const options = useMemo<ChartOptions<"radar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            filter: (legendItem, chartData) => {
              if (legendItem.datasetIndex === undefined) {
                return true;
              }

              const dataset = chartData.datasets[
                legendItem.datasetIndex
              ] as RadarDataset;

              return !dataset.guide;
            },
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const dataset = context.dataset as RadarDataset;
              const tooltip = dataset.tooltipData?.[context.dataIndex];

              if (!tooltip) {
                return `${dataset.label}: ${context.raw}`;
              }

              return [
                `${dataset.label}`,
                `実数値 : ${tooltip.actual}${tooltip.unit ?? ""}`,
                `偏差値 : ${tooltip.deviation}`,
                `順位 : ${tooltip.rank}位`,
              ];
            },
          },
        },
      },
      scales: {
        r: {
          min,
          max,
          ticks: {
            stepSize,
          },
        },
      },
    }),
    [min, max, stepSize],
  );

  return (
    <div className="w-full h-[400px]">
      <Radar data={data} options={options} />
    </div>
  );
};
