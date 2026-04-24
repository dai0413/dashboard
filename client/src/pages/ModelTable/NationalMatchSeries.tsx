import { ModelTableContainer } from "../../components/table";
import { useNationalMatchSeries } from "../../context/models/national-match-series";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const NationalMatchSeries = () => {
  const nationalMatchSeriesContext = useNationalMatchSeries();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"代表試合シリーズ情報"}
        contextState={nationalMatchSeriesContext}
        modelType={ModelType.NATIONAL_MATCH_SERIES}
        linkField={[
          {
            field: "name",
            to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
          },
          {
            field: "country",
            to: APP_ROUTES.NATIONAL_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default NationalMatchSeries;
