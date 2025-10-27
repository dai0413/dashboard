import { useEffect } from "react";
import { ModelTableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { useReferee } from "../../context/models/referee";
import { ModelType } from "../../types/models";
import { useFilter } from "../../context/filter-context";

const Referee = () => {
  const RefereeContext = useReferee();
  const { isOpen } = useForm();
  const { resetFilterConditions } = useFilter();

  useEffect(() => resetFilterConditions(), []);
  useEffect(() => {
    RefereeContext.metacrud.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"審判情報"}
        headers={[
          { label: "名前", field: "name" },
          { label: "英名", field: "en_name" },
          { label: "生年月日", field: "dob" },
        ]}
        contextState={RefereeContext}
        modelType={ModelType.REFEREE}
      />
    </div>
  );
};

export default Referee;
