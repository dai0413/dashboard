import { UseClubTeamSummary } from "../types";
import { DoughnutPlot } from "../../../../../components/plot/Doughnut";
import { StatisticsTable } from "../../../../../components/dataView/DataViewContent/DataView/StatisticsTable";
import { columns } from "../constants/topPanelColumns";

const TopPanel = ({ summary }: { summary: UseClubTeamSummary }) => {
  const {
    panels: {
      top: { text, items },
    },
  } = summary;

  return (
    <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-gray-800">{text}</h2>

      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-4">
        <div className="min-w-0 md:col-span-1">
          <div className="mx-auto w-full max-w-[180px]">
            <DoughnutPlot
              win={items.doughnut.win}
              draw={items.doughnut.draw}
              lose={items.doughnut.lose}
            />
          </div>
          <div className="mt-3 flex justify-center gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <i className="h-2 w-2 rounded-full bg-blue-500" />勝
            </span>
            <span className="flex items-center gap-1">
              <i className="h-2 w-2 rounded-full bg-gray-400" />分
            </span>
            <span className="flex items-center gap-1">
              <i className="h-2 w-2 rounded-full bg-red-500" />敗
            </span>
          </div>
        </div>

        <div className="min-w-0 overflow-x-auto md:col-span-3">
          <StatisticsTable
            columns={columns}
            rows={items.table.rows}
            footerRows={items.table.footerRows}
          />
        </div>
      </div>
    </section>
  );
};

export default TopPanel;
