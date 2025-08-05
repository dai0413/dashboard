import { useNationalMatchSeries } from "../../context/models/national-match-series-context";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";

const NationalMatchSeries = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.NATIONAL_MATCH_SERIES}
      modelType={ModelType.NATIONAL_MATCH_SERIES}
      modelContext={useNationalMatchSeries()}
      title="代表試合シリーズ詳細"
    />
  );
};

export default NationalMatchSeries;
