import { useReferee } from "../../context/models/referee";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const RefereeDetail = () => {
  return (
    <Detail
      modelType={ModelType.REFEREE}
      modelContext={useReferee()}
      title="審判詳細"
    />
  );
};

export default RefereeDetail;
