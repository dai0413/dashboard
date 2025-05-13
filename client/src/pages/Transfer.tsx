import { TableContainer } from "../components/table";
import { TeamProvider } from "../context/team-context";
import { useTransfer, TransferProvider } from "../context/transfer-context";

const Transfer = () => {
  return (
    <TeamProvider>
      <TransferProvider>
        <TableContainer
          title={"移籍情報"}
          headers={[
            { label: "移籍日", field: "doa" },
            { label: "移籍元", field: "from_team" },
            { label: "移籍先", field: "to_team" },
            { label: "名前", field: "player" },
          ]}
          contextHook={useTransfer}
        />
      </TransferProvider>
    </TeamProvider>
  );
};

export default Transfer;
