import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type Plugin,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type Data = {
  win: number;
  draw: number;
  lose: number;
};

const centerTextPlugin: Plugin<"doughnut"> = {
  id: "centerText",
  afterDraw(chart) {
    const { ctx, chartArea } = chart;

    if (!chartArea) return;

    const { left, right, top, bottom } = chartArea;
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;

    const win = chart.data.datasets[0].data[0] as number;
    const draw = chart.data.datasets[0].data[1] as number;
    const lose = chart.data.datasets[0].data[2] as number;

    const total = win + draw + lose;
    const winRate = total > 0 ? (win / total) * 100 : 0;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 勝率の数値
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(winRate.toFixed(1), centerX, centerY);

    // % 記号（小さめ）
    const numberWidth = ctx.measureText(winRate.toFixed(1)).width;

    ctx.font = "12px sans-serif";
    ctx.fillText("%", centerX + numberWidth / 2 + 5, centerY + 10);

    ctx.restore();
  },
};

const options: ChartOptions<"doughnut"> = {
  responsive: true,
  cutout: "72%",
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.parsed;
          return `${context.label}: ${value}`;
        },
      },
    },
  },
};

export const DoughnutPlot: React.FC<Data> = ({ win, draw, lose }) => {
  const data = {
    labels: ["勝", "分", "負"],
    datasets: [
      {
        data: [win, draw, lose],
        backgroundColor: [
          "#3B82F6", // Win: 青
          "#9CA3AF", // Draw: グレー
          "#EF4444", // Lose: 赤
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  return (
    <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
  );
};
