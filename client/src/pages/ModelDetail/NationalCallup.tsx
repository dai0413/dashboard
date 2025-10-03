import { useNationalCallup } from "../../context/models/national-callup";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const NationalMatchSeries = () => {
  return (
    <Detail
      modelType={ModelType.NATIONAL_CALLUP}
      modelContext={useNationalCallup()}
      title="代表招集リスト詳細"
    />
  );
};

export default NationalMatchSeries;
