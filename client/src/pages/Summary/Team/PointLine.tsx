import { TeamMatch } from "../../../types/types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type PointLine = {
  teamMatchs: TeamMatch[];
  plotData: {
    label: string[];
    value: number[];
  };
};

const PointLine: React.FC<PointLine> = ({ teamMatchs, plotData }) => {
  const matchCount = plotData.value.length;

  // 1試合1ポイントペース
  const pace1 = Array.from({ length: matchCount }, (_, i) => i + 1);

  // 1試合2ポイントペース
  const pace2 = Array.from({ length: matchCount }, (_, i) => (i + 1) * 2);

  return (
    <Line
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top" as const,
          },
          title: {
            display: true,
            text: "勝点推移",
          },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                const index = ctx.dataIndex;
                const d = teamMatchs[index];

                return [
                  `勝点: ${plotData.value[index]}`,
                  `${d.match_week}節`,
                  `結果: ${d.result}`,
                  `相手: ${d.against_team.label}`,
                  `スコア: ${d.goal}-${d.against_goal}`,
                ];
              },
            },
          },
        },
      }}
      data={{
        labels: plotData.label,
        datasets: [
          {
            label: "チーム",
            data: plotData.value,
            borderColor: "rgba(26, 192, 20, 1)",
            backgroundColor: "rgba(26, 192, 20, 1)",
            borderWidth: 4,
            tension: 0.3,
          },
          // 1試合1ポイントのペース（赤）
          {
            label: "1pt/match",
            data: pace1,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 1)",
            borderDash: [5, 5],
            borderWidth: 1.5,
            pointRadius: 0,
          },

          // 1試合2ポイントのペース（青）
          {
            label: "2pt/match",
            data: pace2,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 1)",
            borderDash: [5, 5],
            borderWidth: 1.5,
            pointRadius: 0,
          },
        ],
      }}
    />
  );
};

export default PointLine;
