import { TableContainer } from "../../components/table";
import { useTransfer } from "../../context/models/transfer-context";
import { ModelType } from "../../types/models";

const Transfer = () => {
  const transferContext = useTransfer();

  return (
    <TableContainer
      title={"移籍情報"}
      headers={[
        { label: "発表日", field: "doa" },
        { label: "名前", field: "player" },
        { label: "移籍元", field: "from_team" },
        { label: "移籍先", field: "to_team" },
        { label: "形態", field: "form" },
      ]}
      contextState={transferContext}
      modelType={ModelType.TRANSFER}
    />
  );
};

export default Transfer;
