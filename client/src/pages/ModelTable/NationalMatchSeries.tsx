import { ModelTableContainer } from "../../components/table";
import { useNationalMatchSeries } from "../../context/models/national-match-series";
import { ModelType } from "../../types/models";

const NationalMatchSeries = () => {
  const nationalMatchSeriesContext = useNationalMatchSeries();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"代表試合シリーズ情報"}
        contextState={nationalMatchSeriesContext}
        modelType={ModelType.NATIONAL_MATCH_SERIES}
      />
    </div>
  );
};

export default NationalMatchSeries;
