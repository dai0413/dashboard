import { useEffect } from "react";
import { TableContainer } from "../../components/table";
import { useInjury } from "../../context/models/injury-context";
import { ModelType } from "../../types/models";
import { useForm } from "../../context/form-context";

const Injury = () => {
  const injuryContext = useInjury();
  const { isOpen } = useForm();

  useEffect(() => {
    injuryContext.readItems();
  }, [isOpen]);

  return (
    <div className="p-6">
      <TableContainer
        title={"負傷情報"}
        headers={[
          { label: "発表日", field: "doa" },
          { label: "所属", field: "team" },
          { label: "名前", field: "player" },
          { label: "負傷箇所・診断結果", field: "injured_part" },
          { label: "全治", field: "ttp" },
        ]}
        contextState={injuryContext}
        modelType={ModelType.INJURY}
      />
    </div>
  );
};

export default Injury;
