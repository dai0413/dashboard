import { ModelTableContainer } from "../../components/table";
import { useStadium } from "../../context/models/stadium";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ColumnType } from "../../types/table";

const Stadium = () => {
  const stadiumContext = useStadium();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"スタジアム情報"}
        headers={[
          {
            label: "名前",
            field: "name",
            width: "120px",
            type: ColumnType.FIELD,
            id: "name",
          },
          {
            label: "別名",
            field: "alt_names",
            width: "200px",
            type: ColumnType.FIELD,
            id: "alt_names",
          },
          {
            label: "国",
            field: "country",
            type: ColumnType.FIELD,
            id: "country",
          },
        ]}
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
