import { TableContainer } from "../../components/table";
import { useInjury } from "../../context/models/injury-context";
import { ModelType } from "../../types/models";

const Injury = () => {
  const injuryContext = useInjury();

  return (
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
  );
};

export default Injury;
