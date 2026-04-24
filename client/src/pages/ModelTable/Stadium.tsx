import { ModelTableContainer } from "../../components/table";
import { useStadium } from "../../context/models/stadium";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const Stadium = () => {
  const stadiumContext = useStadium();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"スタジアム情報"}
        contextState={stadiumContext}
        modelType={ModelType.STADIUM}
        linkField={[
          {
            field: "country",
            to: APP_ROUTES.NATIONAL_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default Stadium;
