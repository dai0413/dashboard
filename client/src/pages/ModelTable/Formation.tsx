import { ModelTableContainer } from "../../components/table";
import { useFormation } from "../../context/models/formation";
import { ModelType } from "../../types/models";

const Formation = () => {
  const formationContext = useFormation();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"フォーメーション情報"}
        contextState={formationContext}
        modelType={ModelType.FORMATION}
      />
    </div>
  );
};

export default Formation;
