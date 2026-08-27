import { ModelTableContainer } from "../../components/table";
import { useNationalCallup } from "../../context/models/national-callup";
import { ModelType } from "../../types/models";

const NationalMatchSeries = () => {
  const context = useNationalCallup();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"代表招集リスト"}
        contextState={context}
        modelType={ModelType.NATIONAL_CALLUP}
      />
    </div>
  );
};

export default NationalMatchSeries;
