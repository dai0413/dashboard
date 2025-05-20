import { TableContainer } from "../components/table";
import { useTransfer, TransferProvider } from "../context/transfer-context";

const Transfer = () => {
  const transferContext = useTransfer();

  const { formSteps } = transferContext;

  console.log("form steps in Transfer component", formSteps.length);
  return (
    <TransferProvider>
      <TableContainer
        title={"移籍情報"}
        headers={[
          { label: "移籍日", field: "doa" },
          { label: "移籍元", field: "from_team" },
          { label: "移籍先", field: "to_team" },
          { label: "名前", field: "player" },
        ]}
        contextState={transferContext}
      />
    </TransferProvider>
  );
};

export default Transfer;
