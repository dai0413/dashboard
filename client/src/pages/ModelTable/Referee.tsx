import { ModelTableContainer } from "../../components/table";
import { useReferee } from "../../context/models/referee";
import { ModelType } from "../../types/models";
import { ColumnType } from "../../types/table";

const Referee = () => {
  const RefereeContext = useReferee();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"審判情報"}
        headers={[
          {
            label: "名前",
            field: "name",
            type: ColumnType.FIELD,
            id: "name",
            defaultDisplay: true,
          },
          {
            label: "英名",
            field: "en_name",
            type: ColumnType.FIELD,
            id: "en_name",
            defaultDisplay: true,
          },
          {
            label: "生年月日",
            field: "dob",
            type: ColumnType.FIELD,
            id: "dob",
            defaultDisplay: true,
          },
        ]}
        contextState={RefereeContext}
        modelType={ModelType.REFEREE}
      />
    </div>
  );
};

export default Referee;
