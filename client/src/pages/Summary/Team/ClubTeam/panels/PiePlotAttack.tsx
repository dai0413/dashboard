import { ModelType } from "../../../../../types/models";
import { UseClubTeamSummary } from "../types";
import { CustomTableContainer } from "../../../../../components/table";
import { RadarChart } from "../../../../../components/plot/RadarChart/RadarChart";

const PiePlotAttack = ({ summary }: { summary: UseClubTeamSummary }) => {
  const {
    piePlot: { text, items, reloadFun },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <CustomTableContainer
        modelType={ModelType.STATS_L}
        fieldDefinitions={[]}
        pageNum={1}
        items={items.offRadarData?.datasets || []}
        itemsLoading={items.isLoading}
        reloadFun={reloadFun}
        initialData={{
          formData: {},
          metaData: {},
        }}
        renderView={() => (
          <RadarChart
            labels={items.offRadarData?.labels || []}
            datasets={items.offRadarData?.datasets || []}
          />
        )}
      />
    </>
  );
};

export default PiePlotAttack;
