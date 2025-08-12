import { useNationalCallup } from "../../context/models/national-callup";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";

const NationalMatchSeries = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.NATIONAL_CALLUP}
      modelType={ModelType.NATIONAL_CALLUP}
      modelContext={useNationalCallup()}
      title="代表招集リスト詳細"
    />
  );
};

export default NationalMatchSeries;
