import { ModelTableContainer } from "../../components/table";
import { useStatsL } from "../../context/models/stats-l";
import { ModelType } from "../../types/models";

const StatsL = () => {
  const statsLContext = useStatsL();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"スタッツL情報"}
        contextState={statsLContext}
        modelType={ModelType.STATS_L}
      />
    </div>
  );
};

export default StatsL;
