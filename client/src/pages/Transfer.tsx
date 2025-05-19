import { TableContainer } from "../components/table";
import { TeamProvider } from "../context/team-context";
import { useTransfer, TransferProvider } from "../context/transfer-context";

const Transfer = () => {
  const transferContext = useTransfer();
  return (
    <TransferProvider>
      <TeamProvider>
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
      </TeamProvider>
    </TransferProvider>
  );
};

export default Transfer;
