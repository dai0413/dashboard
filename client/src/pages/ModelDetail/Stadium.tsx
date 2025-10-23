import { useStadium } from "../../context/models/stadium";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const Stadium = () => {
  return (
    <Detail
      modelType={ModelType.STADIUM}
      modelContext={useStadium()}
      title="スタジアム詳細"
    />
  );
};

export default Stadium;
