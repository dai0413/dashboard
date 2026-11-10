import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, annotationPlugin);

type ScatterPlotData = {
  x: number;
  y: number;
  label: string;
  color?: string;
};

type Data = {
  data: ScatterPlotData[];
  xLabel?: string;
  yLabel?: string;
  xReverse?: boolean;
  yReverse?: boolean;
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      type: "linear" as const,
      position: "bottom" as const,
      title: {
        display: true,
        text: "X",
      },
    },
    y: {
      title: {
        display: true,
        text: "Y",
      },
    },
  },
};

export const ScatterPlot: React.FC<Data> = ({
  data,
  xLabel = "X",
  yLabel = "Y",
  xReverse = false,
  yReverse = false,
}) => {
  const chartData = {
    datasets: [
      {
        data,
        backgroundColor: data.map((d) => d.color),
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const averageX =
    data.length > 0 ? data.reduce((sum, d) => sum + d.x, 0) / data.length : 0;

  const averageY =
    data.length > 0 ? data.reduce((sum, d) => sum + d.y, 0) / data.length : 0;

  const chartOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const point = context.raw as ScatterPlotData;

            return `${point.label} (${point.x}, ${point.y})`;
          },
        },
      },
      annotation: {
        annotations: {
          averageX: {
            type: "line" as const,
            xMin: averageX,
            xMax: averageX,
            borderColor: "#6B7280",
            borderWidth: 1.5,
            borderDash: [6, 4],
          },
          averageY: {
            type: "line" as const,
            yMin: averageY,
            yMax: averageY,
            borderColor: "#6B7280",
            borderWidth: 1.5,
            borderDash: [6, 4],
          },
        },
      },
    },
    scales: {
      x: {
        ...options.scales.x,
        reverse: xReverse,
        title: {
          display: true,
          text: xLabel,
        },
      },
      y: {
        ...options.scales.y,
        reverse: yReverse,
        title: {
          display: true,
          text: yLabel,
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px]">
      <Scatter data={chartData} options={chartOptions} />
    </div>
  );
};
