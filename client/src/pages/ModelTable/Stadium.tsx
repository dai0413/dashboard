import { ModelTableContainer } from "../../components/table";
import { useStadium } from "../../context/models/stadium";
import { ModelType } from "../../types/models";

const Stadium = () => {
  const stadiumContext = useStadium();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"スタジアム情報"}
        contextState={stadiumContext}
        modelType={ModelType.STADIUM}
      />
    </div>
  );
};

export default Stadium;
