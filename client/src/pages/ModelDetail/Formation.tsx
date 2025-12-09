import { useFormation } from "../../context/models/formation";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const Formation = () => {
  return (
    <Detail
      modelType={ModelType.FORMATION}
      modelContext={useFormation()}
      title="フォーメーション詳細"
    />
  );
};

export default Formation;
