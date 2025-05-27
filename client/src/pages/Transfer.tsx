import { TableContainer } from "../components/table";
import { useTransfer } from "../context/transfer-context";

const Transfer = () => {
  const transferContext = useTransfer();

  return (
    <TableContainer
      title={"移籍情報"}
      headers={[
        { label: "移籍日", field: "doa" },
        { label: "移籍元", field: "from_team" },
        { label: "移籍先", field: "to_team" },
        { label: "名前", field: "player" },
      ]}
      contextState={transferContext}
      modelType={"transfer"}
    />
  );
};

export default Transfer;
