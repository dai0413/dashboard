import { StatisticsTable } from "../../../../components/dataView/DataViewContent/DataView/StatisticsTable";
import { Formation } from "../../../../components/formation";
import { columns } from "../constants/topPanelColumns";
import { UsePlayerSummary } from "../types";

const TopPanel = ({ summary }: { summary: UsePlayerSummary }) => {
  const {
    panels: {
      top: { items },
    },
  } = summary;

  return (
    <div className="space-y-4">
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800">
          {"大会別成績"}
        </h2>

        <div className="grid grid-cols-1 items-center">
          <div className="min-w-0 overflow-x-auto md:col-span-3">
            <StatisticsTable
              columns={columns}
              rows={items.table.rows}
              footerRows={items.table.footerRows}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800">
          {"出場ポジション"}
        </h2>

        <div className="grid grid-cols-1 items-center">
          <div className="min-w-0 overflow-x-auto md:col-span-3">
            <Formation datas={items.positions} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default TopPanel;
